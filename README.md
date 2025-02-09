# CI/CD Pipeline for Pharmacy Locator Application

This repository outlines the setup for the CI/CD pipeline for the **Pharmacy Locator** mobile application. The goal is to automate the integration, testing, and deployment of the application, ensuring a continuous and reliable deployment process, with scalability and monitoring using AWS services.

## Objective

- Implement a **complete CI/CD pipeline** for the Pharmacy Locator application.
- Automate integration, testing, and deployment.
- Ensure scalability and reliability using AWS for production deployment.

## Services Used

- **AWS CodePipeline**: Automates the entire CI/CD pipeline.
- **AWS CodeBuild**: For automated builds and running tests.
- **AWS CodeDeploy**: For automated deployments to Elastic Beanstalk.
- **AWS Elastic Beanstalk**: For hosting and managing the application.

## Pipeline Overview

1. **Code Repository**  
   The source code is managed in GitHub, with CodePipeline configured to trigger builds and deployments.

2. **Continuous Integration (CI)**  
   - **CodeBuild** runs automatically on every code push (commit) to GitHub.
   - Unit tests are executed in **CodeBuild** using tools like **Jest** to ensure code correctness.
   - Code is compiled and tested before moving to the next step in the pipeline.

3. **Automated Testing**  
   - After a successful build, **integration tests** is executed.
   - Tools like **Postman** (for API tests) is integrated into the pipeline.

4. **Continuous Deployment (CD)**  
   - Once tests pass, **CodeDeploy** handles the deployment to **AWS Elastic Beanstalk**.
   - Elastic Beanstalk provides managed hosting for the application, automatically scaling as needed.
   - Deployment is done in stages (e.g., first to a staging environment for validation, then to production).

5. **Security & Monitoring**  
   - **IAM** roles are used to control access and ensure secure interactions between services.
   - **CloudWatch** monitors the health of the application and resources, providing logs and alerts for issues.
   - **CloudTrail** is used for tracking API activity and security auditing.
