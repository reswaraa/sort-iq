import torch
from segment_anything import sam_model_registry, SamPredictor, SamAutomaticMaskGenerator
import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

# Print current working directory
print(f"Current working directory: {os.getcwd()}")

# Choose the model type
MODEL_TYPE = "vit_h"
MODEL_PATH = r"C:\DLWeek\sort-iq\backend\app\services\sam_vit_h.pth"

# Check if model file exists
print(f"Checking if model file exists: {os.path.exists(MODEL_PATH)}")

# Load the model
print("Loading SAM model...")
sam = sam_model_registry[MODEL_TYPE](checkpoint=MODEL_PATH)
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
sam.to(device=device)

predictor = SamPredictor(sam)

# Load an image
image_path = r"C:\DLWeek\sort-iq\backend\app\services\photo_2025-02-18_10-36-28.jpg"
print(f"Checking if image file exists: {os.path.exists(image_path)}")

image = cv2.imread(image_path)
if image is None:
    print(f"Error: Could not read image from {image_path}")
    exit()

print("Image loaded successfully. Shape:", image.shape)
image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Set the image to the predictor
print("Setting image in predictor...")
predictor.set_image(image)

# Display the image
plt.figure(figsize=(8, 8))
plt.imshow(image)
plt.axis("off")
plt.title("Original Image")
plt.tight_layout()
plt.show()

# Single point prompting
print("Predicting with point prompt...")
# You may need to adjust these coordinates based on your image
image_height, image_width = image.shape[:2]
center_x, center_y = image_width // 2, image_height // 2
input_point = np.array([[center_x, center_y]])  # Center of the image
input_label = np.array([1])  # 1 = foreground

masks, scores, logits = predictor.predict(
    point_coords=input_point,
    point_labels=input_label,
    multimask_output=True
)

# Visualize the point-prompted segmentation
plt.figure(figsize=(15, 5))
for i, mask in enumerate(masks):
    plt.subplot(1, 3, i + 1)
    plt.imshow(image)
    show_mask = np.ma.masked_where(~mask, mask)
    plt.imshow(show_mask, alpha=0.5, cmap="jet")  # Overlay mask
    plt.scatter(input_point[:, 0], input_point[:, 1], color='red', s=40, marker='*')
    plt.axis("off")
    plt.title(f"Mask {i+1} - Score: {scores[i]:.3f}")
plt.tight_layout()
plt.show()

# Automatic mask generation
print("Generating automatic masks... (this may take a while)")
mask_generator = SamAutomaticMaskGenerator(
    model=sam,
    points_per_side=32,
    pred_iou_thresh=0.86,
    stability_score_thresh=0.92,
    crop_n_layers=1,
    crop_n_points_downscale_factor=2,
    min_mask_region_area=100  # Filters small disconnected regions
)

masks = mask_generator.generate(image)
print(f"Generated {len(masks)} masks")

# Sort masks by area
sorted_masks = sorted(masks, key=lambda x: x['area'], reverse=True)

# Visualize masks (limited to top 20 by area to keep visualization clean)
def show_anns(anns):
    if len(anns) == 0:
        return
    
    # Create a color map for the masks
    sorted_anns = sorted(anns, key=lambda x: x['area'], reverse=True)
    ax = plt.gca()
    ax.set_autoscale_on(False)
    
    img = np.ones((sorted_anns[0]['segmentation'].shape[0], sorted_anns[0]['segmentation'].shape[1], 4))
    img[:,:,3] = 0
    
    for i, ann in enumerate(sorted_anns):
        if i >= 20:  # Limit to top 20 masks
            break
            
        m = ann['segmentation']
        color_mask = np.array([np.random.random(), np.random.random(), np.random.random(), 0.6])
        img[m] = color_mask
    
    ax.imshow(img)

# Visualize all masks
plt.figure(figsize=(10, 10))
plt.imshow(image)
show_anns(sorted_masks)
plt.axis("off")
plt.title(f"Automatic Segmentation ({min(len(sorted_masks), 20)} largest masks shown)")
plt.tight_layout()
plt.show()

# Display top 3 masks individually
if len(sorted_masks) >= 3:
    plt.figure(figsize=(15, 5))
    for i in range(min(3, len(sorted_masks))):
        plt.subplot(1, 3, i + 1)
        plt.imshow(image)
        mask = sorted_masks[i]['segmentation']
        show_mask = np.ma.masked_where(~mask, mask)
        plt.imshow(show_mask, alpha=0.5, cmap="cool")
        plt.axis("off")
        plt.title(f"Mask {i+1} - Area: {sorted_masks[i]['area']}")
    plt.tight_layout()
    plt.show()

print("Segmentation completed successfully!")