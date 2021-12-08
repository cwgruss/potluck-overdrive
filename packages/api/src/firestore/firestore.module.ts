import { Module, DynamicModule } from '@nestjs/common';
import {
  FirestoreDatabaseProvider,
  FirestoreOptionsProvider,
  FirestoreCollectionProviders,
} from './firestore.provider';
import { initializeApp, FirebaseOptions } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';

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
      provide: FirestoreDatabaseProvider,
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
          return collection(db, providerName);
        },
        inject: [FirestoreDatabaseProvider],
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
