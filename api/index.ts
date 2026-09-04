import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';

const router = express.Router();

router.use(cors());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: true }));

router.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/api/drive/backup', async (req, res) => {
  try {
    const { data, accessToken } = req.body;
    if (!accessToken) {
      return res.status(401).json({ error: 'Missing access token' });
    }
    
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    
    const fileMetadata = {
      name: 'principia_backup.json',
      mimeType: 'application/json'
    };
    
    const media = {
      mimeType: 'application/json',
      body: JSON.stringify(data)
    };
    
    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id'
    });
    
    res.json({ success: true, fileId: file.data.id });
  } catch (error: any) {
    console.error('Drive API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// For Vercel Serverless Function support, we can export the app directly
const app = express();
app.use(router);
export default app;
