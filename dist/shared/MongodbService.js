"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoService = void 0;
// src/mongo/mongo.service.ts
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
let MongoService = class MongoService {
    async onModuleInit() {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
        this.client = new mongodb_1.MongoClient(uri);
        console.log("mongo db uri :", process.env.MONGO_URI);
        try {
            await this.client.connect();
            // Ping the database
            await this.client.db('admin').command({ ping: 1 });
            console.log('Pinged your deployment. Successfully connected to MongoDB!');
        }
        catch (err) {
            console.error('Failed to connect to MongoDB:', err);
        }
    }
    getClient() {
        return this.client;
    }
    async closeConnection() {
        await this.client.close();
    }
};
exports.MongoService = MongoService;
exports.MongoService = MongoService = __decorate([
    (0, common_1.Injectable)()
], MongoService);
//# sourceMappingURL=mongodbService.js.map