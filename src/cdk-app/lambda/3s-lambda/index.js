// Main Lambda handler function
const AWS = require('aws-sdk');
const sharp = require('sharp'); // Image processing library

const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  try {
    const bucketName = process.env.BUCKET_NAME;
    const objectKey = event.Records[0].s3.object.key;

    if (objectKey.startsWith('avatar/thumbnail')) {
      console.log(
        'Skipping processing for already processed object:',
        objectKey,
      );

      return 'Object already processed';
    }

    const originalImage = await s3
      .getObject({ Bucket: bucketName, Key: objectKey })
      .promise();

    const resizedImage = await sharp(originalImage.Body)
      .resize({ width: 100, height: 100 })
      .toBuffer();
    const contentType = originalImage.ContentType;

    await s3
      .putObject({
        Bucket: bucketName,
        Key: `avatar/thumbnail-${objectKey.split('/')[1]}`,
        Body: resizedImage,
        ContentType: contentType,
      })
      .promise();

    // Example response
    console.log('Image resized and uploaded successfully');
    return 'Image resized and uploaded successfully';
  } catch (error) {
    console.error('Error:', error);

    // Return error message
    throw new Error('Something went wrong', error);
  }
};
