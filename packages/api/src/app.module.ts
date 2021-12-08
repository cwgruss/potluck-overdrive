import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IngredientsModule } from './ingredients/ingredients.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        apiKey: config.get<string>('FIREBASE_API_KEY'),
        authDomain: config.get<string>('FIREBASE_AUTH_DOMAIN'),
        projectId: config.get<string>('FIREBASE_PROJECT_ID'),
        storageBucket: config.get<string>('FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: config.get<string>('FIREBASE_MESSAGING_SENDER_ID'),
        appId: config.get<string>('FIREBASE_APP_ID'),
        measurementId: config.get<string>('FIREBASE_MEASUREMENT_ID'),
      }),
      inject: [ConfigService],
    }),
    IngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
