FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy and install the common library first
COPY lmsCommonLib/ ./lmsCommonLib/
RUN cd lmsCommonLib && mvn clean install -DskipTests

# Copy the service and build it
COPY enrollmentService/lms/ ./enrollmentService/lms/
RUN cd enrollmentService/lms && mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/enrollmentService/lms/target/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]