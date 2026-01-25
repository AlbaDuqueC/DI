// src/data/datasource/AzureAPI.ts

import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class AzureAPI {
  private readonly _apiUrl: string;

  constructor() {
    // Aquí colocas la URL de tu API de Azure
    this._apiUrl = 'https://signalrchat20260115133542-dzc0arewgxbrh5gu.spaincentral-01.azurewebsites.net/api';
  }

  public getConnection(): string {
    return this._apiUrl;
  }

  public async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this._apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en GET:', error);
      throw error;
    }
  }

  public async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this._apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en POST:', error);
      throw error;
    }
  }

  public async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this._apiUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en PUT:', error);
      throw error;
    }
  }

  public async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this._apiUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en DELETE:', error);
      throw error;
    }
  }
}