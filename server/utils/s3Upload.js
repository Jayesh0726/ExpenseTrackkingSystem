import aws from 'aws-sdk';

// Configure AWS S3
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

/**
 * Upload file to S3
 * @param {File} file - File object from input
 * @param {string} folder - Folder path in S3 (e.g., 'receipts/2025-01')
 * @returns {Promise<string>} - S3 file URL
 */
export const uploadToS3 = async (file, folder = 'receipts') => {
  try {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      ACL: 'public-read', // Make file publicly readable
    };

    const result = await s3.upload(params).promise();
    return result.Location; // S3 URL
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Delete file from S3
 * @param {string} fileUrl - Full S3 URL or key
 * @returns {Promise<void>}
 */
export const deleteFromS3 = async (fileUrl) => {
  try {
    // Extract key from URL if needed
    const key = fileUrl.includes('s3.amazonaws.com') 
      ? fileUrl.split(`${process.env.AWS_BUCKET_NAME}.s3`)[1].replace(/^\.amazonaws\.com/, '')
      : fileUrl;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Generate presigned URL for private files
 * @param {string} key - S3 object key
 * @param {number} expiration - URL expiration in seconds (default: 1 hour)
 * @returns {Promise<string>} - Presigned URL
 */
export const generatePresignedUrl = async (key, expiration = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Expires: expiration,
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    throw new Error(`Failed to generate presigned URL: ${error.message}`);
  }
};
