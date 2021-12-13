import { DynamicModule, Module } from '@nestjs/common';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { NormalizedCollection } from './firestore.converter';
import {
  FirestoreCollectionProviders,
  FirestoreDatabase,
  FirestoreOptionsProvider,
} from './firestore.provider';

type FirestoreModuleOptions = {
  imports: any[];
  useFactory: (...args: any[]) => FirebaseOptions;
  inject: any[];
};

@Module({})
export class FirestoreModule {
  static forRoot(options: FirestoreModuleOptions): DynamicModule {
    const optionsProvider = {
      provide: FirestoreOptionsProvider,
      useFactory: options.useFactory,
      inject: options.inject,
    };

    const dbProvider = {
      provide: FirestoreDatabase,
      useFactory: (firebaseConfig) => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        return db;
      },
      inject: [FirestoreOptionsProvider],
    };

    const collectionProviders = FirestoreCollectionProviders.map(
      (providerName) => ({
        provide: providerName,
        useFactory: (db) => {
          return NormalizedCollection(db, providerName);
        },
        inject: [FirestoreDatabase],
      }),
    );

    return {
      global: true,
      module: FirestoreModule,
      imports: options.imports,
      providers: [optionsProvider, dbProvider, ...collectionProviders],
      exports: [dbProvider, ...collectionProviders],
    };
  }
}
