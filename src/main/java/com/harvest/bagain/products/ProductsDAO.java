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
import com.harvest.bagain.productsphoto.ProductPhoto;
import com.harvest.bagain.productsphoto.ProductPhotoRepository;

@Service
public class ProductsDAO {

    @Autowired
    private CategoryRepository cateRepo;

    @Autowired
    private ProductsRepository prodRepo;
    
    @Autowired
    private ProductPhotoRepository productPhotoRepo;

    @Value("${products.images.directory}")
    private String productsImagesDirectory;

    @Value("${productcomment.images.directory}")
    private String productCommentImagesDirectory;

    // 카테고리 이름으로 상품 목록 조회
    public List<Products> getProductsByCategoryName(String categoryName) {
        Optional<Category> category = cateRepo.findByName(categoryName);
        if (category.isPresent()) {
            List<Products> products = prodRepo.findByCategory(category.get());
            for (Products product : products) {
                List<ProductPhoto> productPhotos = productPhotoRepo.findByProduct(product);
                product.setProductPhotos(productPhotos);
                String productImageUrl = product.getPhoto() != null ? "https://file.bargainus.kr/products/images/" + product.getPhoto() : "";
                product.setPhoto(productImageUrl);
                for (ProductPhoto productPhoto : productPhotos) {
                    productPhoto.setPhotoUrl("https://file.bargainus.kr/productcomment/images/" + productPhoto.getPhotoUrl());
                }
            }
            return products;
        } else {
            return new ArrayList<>();
        }
    }

    // 상품 등록
    public Map<String, Object> addProduct(ProductsAddReq req, MultipartFile photo, MultipartFile[] commentphoto) {
        String productImageFileName = null;
        Map<String, Object> response = new HashMap<>();
        try {
            // 상품 사진 저장
            if (photo != null && !photo.isEmpty()) {
                productImageFileName = BagainFileNameGenerator.generate(photo);
                photo.transferTo(new File(productsImagesDirectory + "/" + productImageFileName));
                req.setPhotoFilename(productImageFileName); // DTO에 파일명만 저장
            }
            
            // Products 객체 생성 및 저장
            Products product = new Products();
            product.setName(req.getName());
            product.setPrice(req.getPrice());
            product.setInventory(req.getInventory());
            product.setComment(req.getComment());
            product.setPhoto(productImageFileName);
            Optional<Category> categoryOpt = cateRepo.findById(req.getCategoryCode());
            if (!categoryOpt.isPresent()) {
                response.put("status", false);
                response.put("message", "유효하지 않은 카테고리 코드입니다.");
                return response;
            }
            product.setCategory(categoryOpt.get());
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
                        productPhoto.setPhotoUrl("https://file.bargainus.kr/productcomment/images/" + commentImageFileName);
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
}
