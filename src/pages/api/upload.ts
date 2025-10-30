import { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'messaging-app',
    allowed_formats: ['jpg', 'png', 'pdf', 'zip'],
  } as any,
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    upload.single('file')(req as any, res as any, (err: any) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      const file = (req as any).file;
      res.status(200).json({ fileUrl: file.path, fileName: file.originalname });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
