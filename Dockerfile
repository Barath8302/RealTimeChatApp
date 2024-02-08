 FROM node:19-alpine 
#base image
WORKDIR /app
#create /app dir in virtual machine of docker
 COPY package.json /app/
  #copy all dependencies and packages
 COPY . .
#copy content in current directory


 RUN npm install

 EXPOSE 3000
 #run on port 3000
 CMD ["node","server.js"]
 #run server.js