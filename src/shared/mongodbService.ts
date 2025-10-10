// src/mongo/mongo.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit {
  private client: MongoClient;

  async onModuleInit() {
    
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
    this.client = new MongoClient(uri);
    console.log("mongo db uri :",process.env.MONGO_URI)
    try {
      await this.client.connect();
      // Ping the database
      await this.client.db('admin').command({ ping: 1 });
      console.log('Pinged your deployment. Successfully connected to MongoDB!');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
    }
  }

  getClient(): MongoClient {
    return this.client;
  }

  async closeConnection() {
    await this.client.close();
  }
}
