import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

          
cloudinary.config({ 
  cloud_name: 'de9jpxgcn', 
  api_key: '379241287929347', 
  api_secret: 'LLd59O-WqPn6sGg2DFUAF1-mA3w' 
});

const uploadOnCloudinary= async(localFilePath)=>{
    try {
        if(!localFilePath){
            return res.status(501).send('no file path found');
        }
        else{
            const response= await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log('file uploaded successfully',response.url)
            return response
        }

    } catch (error) {
          fs.unlinkSync(localFilePath); //removed the local file saved path
          return null
    }
}
export default uploadOnCloudinary
