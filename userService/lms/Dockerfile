FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy and install the common library first
COPY lmsCommonLib/ ./lmsCommonLib/
RUN cd lmsCommonLib && mvn clean install -DskipTests

# Copy the service and build it
COPY userService/lms/ ./userService/lms/
RUN cd userService/lms && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/userService/lms/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]