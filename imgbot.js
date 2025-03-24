const sharp=require("sharp");
const fs=require("fs");
const path=require("path");

const inputFolder="public/movies/poster";  // Input folder
const outputFolder="public/img/poster";       // Output folder

// Ensure output folder exists
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// Allowed image formats for compression
const validFormats=["jpg", "jpeg", "png", "webp", "tiff", "gif"];

// Function to process images
async function processImages() {
    try {
        const files=fs.readdirSync(inputFolder);

        for (const file of files) {
            const inputPath=path.join(inputFolder, file);
            const outputPath=path.join(outputFolder, file);

            // Skip directories
            if (!fs.lstatSync(inputPath).isFile()) continue;

            try {
                const metadata=await sharp(inputPath).metadata();
                const format=metadata.format;

                if (validFormats.includes(format)) {
                    // Compress the image
                    await sharp(inputPath)
                        .resize({ width: 800 }) // Resize width (optional)
                        .toFormat(format, { quality: 60 }) // Keep original format
                        .toFile(outputPath);

                    console.log(`✅ Compressed: ${file}`);
                } else {
                    // Copy unsupported image as is
                    fs.copyFileSync(inputPath, outputPath);
                    console.warn(`⚠️ Copied without compression: ${file}`);
                }
            } catch (imgError) {
                // If sharp fails, copy the file as is
                fs.copyFileSync(inputPath, outputPath);
                console.error(`🚨 Error compressing ${file}, copied instead.`);
            }
        }

        console.log("🎉 All images processed successfully!");
    } catch (error) {
        console.error("🚨 Error processing images:", error);
    }
}

// Run the script
processImages();
