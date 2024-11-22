package com.harvest.bagain.products;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
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
	public Map<String, Object> addProduct(ProductsAddReq req, MultipartFile photo, MultipartFile[] commentphoto,
			Users user) {
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

	public Map<String, Object> deleteProductBySeller(Users seller, Integer pcode) {
		Map<String, Object> response = new HashMap<>();
		try {
			Optional<Products> productOpt = prodRepo.findById(pcode);
			if (productOpt.isPresent() && productOpt.get().getSeller().getCode().equals(seller.getCode())) {
				prodRepo.delete(productOpt.get());
				response.put("status", true);
				response.put("message", "상품 삭제 성공");
			} else {
				response.put("status", false);
				response.put("message", "상품을 찾을 수 없거나 권한이 없습니다.");
			}
		} catch (Exception e) {
			response.put("status", false);
			response.put("message", "상품 삭제 실패");
		}
		return response;
	}

	public List<Products> getProductsByCategoryName(String categoryName, Users user) {
		Optional<Category> category = cateRepo.findByName(categoryName);
		if (category.isPresent()) {
			List<Products> products = prodRepo.findByCategory(category.get());

			for (Products product : products) {
				// 사진 처리
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

				// likedStatus 처리
				if (user != null) {
					Optional<Liked> likedOptional = likedRepo.findByUserAndProduct(user, product);
					boolean likedStatus = likedOptional.isPresent()
							&& Boolean.TRUE.equals(likedOptional.get().getLikedStatus());
					product.setLikedStatus(likedStatus);
				} else {
					product.setLikedStatus(false);
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

	// 내가 등록한 상품 목록 조회
	public Map<String, Object> getProductsBySeller(Users seller) {
		Map<String, Object> response = new HashMap<>();
		try {
			List<Products> productsList = prodRepo.findBySeller(seller);
			for (Products product : productsList) {
				String productImageUrl = product.getPhoto() != null
						? "https://file.bargainus.kr/products/images/" + product.getPhoto()
						: "";
				product.setPhoto(productImageUrl);
				List<ProductPhoto> productPhotos = productPhotoRepo.findByProduct(product);
				for (ProductPhoto productPhoto : productPhotos) {
					productPhoto.setPhotoUrl(
							"https://file.bargainus.kr/productcomment/images/" + productPhoto.getPhotoUrl());
				}
				product.setProductPhotos(productPhotos);
			}
			response.put("status", true);
			response.put("products", productsList);
		} catch (Exception e) {
			response.put("status", false);
			response.put("message", "상품 목록 조회 실패");
		}
		return response;
	}

	// 사용자 코드로 사용자 조회
	public Optional<Users> getUserByCode(Integer userCode) {
		return userRepo.findById(userCode);
	}

	public Optional<Users> getUserByEmail(String email) {
		return userRepo.findByEmail(email);
	}

	public synchronized Map<String, Object> searchProducts(String keyword, Users userOptional) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 키워드 초기 상태 확인
            if (keyword == null) {
                response.put("status", false);
                response.put("message", "검색어는 두 글자 이상 입력해야 합니다.");
                return response;
            }

            keyword = keyword.trim();

            if (keyword.isEmpty() || keyword.length() < 2) {
                response.put("status", false);
                response.put("message", "검색어는 두 글자 이상 입력해야 합니다.");
                return response;
            }

            // 데이터베이스 쿼리 전 상태 확인
            List<Products> productsList = prodRepo.findByNameContainingIgnoreCaseOrCommentContainingIgnoreCase(keyword, keyword);

            // 검색 결과가 없을 경우
            if (productsList.isEmpty()) {
                response.put("status", false);
                response.put("message", "상품 결과 없음");
                return response;
            }

            for (Products product : productsList) {
                try {
                    String productImageUrl = product.getPhoto() != null
                            ? "https://file.bargainus.kr/products/images/" + product.getPhoto()
                            : "";
                    product.setPhoto(productImageUrl);

                    // 상품 사진 처리
                    List<ProductPhoto> productPhotos = productPhotoRepo.findByProduct(product);
                    for (ProductPhoto productPhoto : productPhotos) {
                        try {
                            productPhoto.setPhotoUrl("https://file.bargainus.kr/productcomment/images/" + productPhoto.getPhotoUrl());
                        } catch (Exception e) {
                        }
                    }
                    product.setProductPhotos(productPhotos);

                    // likedStatus 처리
                    if (userOptional != null) {
                        try {
                            Optional<Liked> likedOptional = likedRepo.findByUserAndProduct(userOptional, product);
                            boolean likedStatus = likedOptional.isPresent() && Boolean.TRUE.equals(likedOptional.get().getLikedStatus());
                            product.setLikedStatus(likedStatus);
                        } catch (Exception e) {
                            product.setLikedStatus(false); // 기본값 설정
                        }
                    } else {
                        product.setLikedStatus(false);
                    }
                } catch (Exception e) {
                }
            }
            response.put("status", true);
            response.put("products", productsList);
        } catch (IllegalArgumentException e) {
            response.put("status", false);
            response.put("message", "잘못된 요청입니다. 입력값을 확인하세요.");
        } catch (Exception e) {
            response.put("status", false);
            response.put("message", "상품 검색 실패");
        }
        return response;
    }

	// 찜하기
	@Transactional
	public Map<String, Object> toggleLikeProduct(Users user, Integer productCode) {
		Map<String, Object> response = new HashMap<>();
		Optional<Liked> optionalLiked = likedRepo.findByUser_CodeAndProduct_Pcode(user.getCode(), productCode);

		if (optionalLiked.isPresent()) {
			Liked liked = optionalLiked.get();
			if (Boolean.TRUE.equals(liked.getLikedStatus())) {
				liked.setLikedStatus(false);
				int newLikesCount = Optional.ofNullable(liked.getProduct().getLikesCount()).orElse(0) - 1;
				liked.getProduct().setLikesCount(Math.max(newLikesCount, 0)); // likesCount가 음수가 되지 않도록 설정
				response.put("message", "찜 목록에서 삭제되었습니다.");
			} else {
				liked.setLikedStatus(true);
				liked.getProduct().setLikesCount(Optional.ofNullable(liked.getProduct().getLikesCount()).orElse(0) + 1);
				response.put("message", "찜 목록에 추가되었습니다.");
			}
			likedRepo.save(liked);
		} else {
			// 새로운 찜하기 객체 생성
			Liked newLiked = new Liked();
			newLiked.setProduct(prodRepo.findById(productCode).orElseThrow());
			newLiked.setUser(user);
			newLiked.setLikedStatus(true);
			likedRepo.save(newLiked);
			newLiked.getProduct()
					.setLikesCount(Optional.ofNullable(newLiked.getProduct().getLikesCount()).orElse(0) + 1);
			response.put("message", "찜 목록에 추가되었습니다.");
		}
		response.put("status", true);
		response.put("likedStatus", response.get("message").equals("찜 목록에 추가되었습니다."));
		return response;
	}
}
