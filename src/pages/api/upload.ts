
import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import formidable, { type Fields, type Files } from 'formidable';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const form = formidable({});

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        res.status(500).json({ error: 'Error parsing the form data' });
        return;
      }

      const file = (files as any).file;

      if (!file) {
        res.status(400).json({ error: 'No file found in the request' });
        return;
      }

      try {
        // @ts-ignore
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'messaging-app',
        });
        // @ts-ignore
        fs.unlinkSync(file.filepath); // Clean up the temporary file

        res.status(200).json({
          fileUrl: result.secure_url,
          fileName: result.original_filename,
        });
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ error: 'Error uploading to Cloudinary' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
