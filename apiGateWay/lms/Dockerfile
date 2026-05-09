FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy and build the gateway
COPY apiGateWay/lms/ ./apiGateWay/lms/
RUN cd apiGateWay/lms && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/apiGateWay/lms/target/*.jar app.jar

EXPOSE 9000

ENTRYPOINT ["java", "-jar", "app.jar"]