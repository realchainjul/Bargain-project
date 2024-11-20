package com.harvest.bagain.products;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.harvest.bagain.BagainFileNameGenerator;
import com.harvest.bagain.category.Category;
import com.harvest.bagain.category.CategoryRepository;
import com.harvest.bagain.liked.Liked;
import com.harvest.bagain.liked.LikedRepository;
import com.harvest.bagain.productsphoto.ProductPhoto;
import com.harvest.bagain.productsphoto.ProductPhotoRepository;
import com.harvest.bagain.users.Users;
import com.harvest.bagain.users.UsersRepository;

import jakarta.transaction.Transactional;

@Service
public class ProductsDAO {

	@Autowired
    private CategoryRepository cateRepo;

    @Autowired
    private ProductsRepository prodRepo;

    @Autowired
    private ProductPhotoRepository productPhotoRepo;

    @Autowired
    private LikedRepository likedRepo;

    @Autowired
    private UsersRepository userRepo;

	@Value("${products.images.directory}")
	private String productsImagesDirectory;

	@Value("${productcomment.images.directory}")
	private String productCommentImagesDirectory;

	// 상품 등록
	public Map<String, Object> addProduct(ProductsAddReq req, MultipartFile photo, MultipartFile[] commentphoto, Users user) {
        String productImageFileName = null;
        Map<String, Object> response = new HashMap<>();
        try {
            // 상품 사진 저장
            if (photo != null && !photo.isEmpty()) {
                productImageFileName = BagainFileNameGenerator.generate(photo);
                photo.transferTo(new File(productsImagesDirectory + "/" + productImageFileName));
                req.setPhotoFilename(productImageFileName); // DTO에 파일명만 저장
            }

            // 카테고리 이름 변환
            String englishCategoryName = convertCategoryNameToEnglish(req.getCategoryName());
            Optional<Category> categoryOpt = cateRepo.findByName(englishCategoryName);

            if (categoryOpt.isEmpty()) {
                response.put("status", false);
                response.put("message", "유효하지 않은 카테고리 이름");
                return response;
            }

            // Products 객체 생성 및 저장
            Products product = new Products();
            product.setName(req.getName());
            product.setPrice(req.getPrice());
            product.setInventory(req.getInventory());
            product.setComment(req.getComment());
            product.setPhoto(productImageFileName);
            product.setCategory(categoryOpt.get());
            product.setLikesCount(0);
            product.setSeller(user);
            prodRepo.save(product);

            // 상세 내용 이미지 저장 및 ProductPhoto 엔티티 저장
            if (commentphoto != null && commentphoto.length > 0) {
                List<String> commentPhotoFilenames = new ArrayList<>();
                for (MultipartFile commentImage : commentphoto) {
                    if (commentImage != null && !commentImage.isEmpty()) {
                        String commentImageFileName = BagainFileNameGenerator.generate(commentImage);
                        commentImage.transferTo(new File(productCommentImagesDirectory + "/" + commentImageFileName));
                        commentPhotoFilenames.add(commentImageFileName);

                        // ProductPhoto 객체 저장
                        ProductPhoto productPhoto = new ProductPhoto();
                        productPhoto.setProduct(product);
                        productPhoto.setPhotoUrl(commentImageFileName);
                        productPhotoRepo.save(productPhoto);
                    }
                }
                req.setCommentPhotoFilenames(commentPhotoFilenames.toArray(new String[0])); // 파일명들 저장
                product.setProductPhotos(productPhotoRepo.findByProduct(product)); // ProductPhoto 리스트 설정
            }

            response.put("status", true);
            response.put("message", "상품 등록 성공");
        } catch (Exception e) {
            if (productImageFileName != null) {
                new File(productsImagesDirectory + "/" + productImageFileName).delete();
            }
            response.put("status", false);
            response.put("message", "상품 등록 실패");
        }
        return response;
    }

	// 카테고리 이름을 영어로 변환하는 메서드
	private String convertCategoryNameToEnglish(String koreanCategoryName) {
		switch (koreanCategoryName) {
		case "과일":
			return "fruits";
		case "채소":
			return "vegetable";
		case "곡물":
			return "grain";
		default:
			throw new IllegalArgumentException("유효하지 않은 카테고리 이름입니다: " + koreanCategoryName);
		}
	}

	// 카테고리 이름으로 상품 목록 조회
	public List<Products> getProductsByCategoryName(String categoryName) {
	    Optional<Category> category = cateRepo.findByName(categoryName);
	    if (category.isPresent()) {
	        List<Products> products = prodRepo.findByCategory(category.get());
	        for (Products product : products) {
	            List<ProductPhoto> productPhotos = productPhotoRepo.findByProduct(product);
	            product.setProductPhotos(productPhotos);
	            String productImageUrl = product.getPhoto() != null
	                    ? "https://file.bargainus.kr/products/images/" + product.getPhoto()
	                    : "";
	            product.setPhoto(productImageUrl);
	            for (ProductPhoto productPhoto : productPhotos) {
	                productPhoto.setPhotoUrl(
	                        "https://file.bargainus.kr/productcomment/images/" + productPhoto.getPhotoUrl());
	            }
	        }
	        return products;
	    } else {
	        return new ArrayList<>();
	    }
	}


	// 카테고리 이름과 상품 코드로 단일 상품 조회
	public Optional<Products> getProductByCategoryAndPcode(String categoryName, Integer pcode) {
		return cateRepo.findByName(categoryName)
				.flatMap(category -> prodRepo.findProductByCategoryAndPcode(category, pcode)).map(prod -> {
					List<ProductPhoto> productPhotos = productPhotoRepo.findByProduct(prod);
					prod.setProductPhotos(productPhotos);
					String productImageUrl = prod.getPhoto() != null
							? "https://file.bargainus.kr/products/images/" + prod.getPhoto()
							: "";
					prod.setPhoto(productImageUrl);
					for (ProductPhoto productPhoto : productPhotos) {
						productPhoto.setPhotoUrl(
								"https://file.bargainus.kr/productcomment/images/" + productPhoto.getPhotoUrl());
					}
					return prod;
				});
	}
	// 상품 코드로 상품 조회
    public Optional<Products> getProductByCode(Integer productCode) {
        return prodRepo.findById(productCode);
    }

    // 사용자 코드로 사용자 조회
    public Optional<Users> getUserByCode(Integer userCode) {
        return userRepo.findById(userCode);
    }
    
    public Optional<Users> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    // 찜하기
    @Transactional
    public Map<String, Object> toggleLikeProduct(Users user, Products product) {
        Optional<Liked> optionalLiked = likedRepo.findByUserAndProduct(user, product);
        if (optionalLiked.isPresent()) {
            // 기존 찜하기가 있으면 삭제
            likedRepo.delete(optionalLiked.get());
            product.setLikesCount(Math.max(Optional.ofNullable(product.getLikesCount()).orElse(0) - 1, 0));
            return Map.of("status", true, "message", "찜하기가 삭제되었습니다.");
        } else {
            // 찜하기가 없으면 새로 추가
            Liked liked = new Liked();
            liked.setProduct(product);
            liked.setUser(user);
            liked.setLikedStatus(true);
            likedRepo.save(liked);
            product.setLikesCount(Optional.ofNullable(product.getLikesCount()).orElse(0) + 1);
            return Map.of("status", true, "message", "찜하기가 추가되었습니다.");
        }
    }
}
