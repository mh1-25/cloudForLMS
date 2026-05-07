FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy and install the common library first
COPY lmsCommonLib/ ./lmsCommonLib/
RUN cd lmsCommonLib && mvn clean install -DskipTests

# Copy the service and build it
COPY authService/lms/ ./authService/lms/
RUN cd authService/lms && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/authService/lms/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]