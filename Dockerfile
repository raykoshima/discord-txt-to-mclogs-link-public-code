# Use the official Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port (if needed for debugging or other purposes)
# EXPOSE 3000

# Define the command to run the application
CMD ["node", "bot.js"]
