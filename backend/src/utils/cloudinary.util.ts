import cloudinary from "@/config/cloudinary.config.js";
export const uploadToCloudinary = async (filePath: string): Promise<any> => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'expense_tracker',
        });
        return {
            url: result.url,
            publicId: result.public_id
        };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(
                `Cloudinary delete error: ${error.message}`
            );
        } else {
            throw new Error('Cloudinary delete error: unknown error');
        }
    }
};

export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(
                `Cloudinary delete error: ${error.message}`
            );
        } else {
            throw new Error('Cloudinary delete error: unknown error');
        }
    }
};