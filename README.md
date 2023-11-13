# fileshare
Fullstack application for file uploading using Vue 3 (composition API) and Node JS

## Tech stack and libraries used:
Frontend: Vue 3, sweetalert (notifacation popup), pinia(global state management, bootstrap4, sass(.scss extension))

Backend: Node JS, MySQL, express, AWS s3, Sequalize(ORM), bullmq (job processing queue)

## Application Flow
### Happy flow (assuming no errors in any step)

#### Upload Flow
1. User has selected file to upload
2. File validation is done on FE (as of now, max file size of 200MB is the only validation)
3. FE makes an api call to BE to get presigned url to upload file diretly to S3 from FE
4. Node js then generates an presigned url using aws sdk's
5. Once FE gets the upload URL, it opens an PUT request to presigned URL which will upload file in the S3 bucket
6. On success upload to S3, FE will send another api call to BE saying file is uploaded to S3
7. BE will take the file details (s3key, filename, upload date, size) and add it in MySQL using Sequalize ORM


#### Delete Flow
1. User clicks the delete button from listing
2. Confirmation popup is displayed
3. On confirming the delete, FE will make an api call to BE
4. BE will remove the entry from MySQL using Sequalize ORM
5. On success delete from MySQL, FE will then remove the row from listing
6. Using bullmq (job processing queue for node), add deletion of that object from s3 in the files-queue
