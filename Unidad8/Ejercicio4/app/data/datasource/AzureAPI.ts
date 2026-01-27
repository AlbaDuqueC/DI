// app/data/datasource/AzureAPI.ts

import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class AzureAPI {
  private readonly _apiUrl: string;

  constructor() {
    this._apiUrl = 'https://ejercicio3-bve6ckbmchebczg4.spaincentral-01.azurewebsites.net/api';
    console.log('✅ AzureAPI inicializada con URL:', this._apiUrl);
  }

  public getConnection(): string {
    return this._apiUrl;
  }

  public async get<T>(endpoint: string): Promise<T> {
    const fullUrl = `${this._apiUrl}${endpoint}`;
    console.log(`🌐 GET Request: ${fullUrl}`);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📡 GET Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ GET Error Response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ GET Success:`, endpoint, '- Datos recibidos:', Array.isArray(data) ? `${data.length} items` : 'objeto');
      console.log('📦 Datos completos:', data);
      
      return data;
    } catch (error) {
      console.error(`❌ Error en GET ${endpoint}:`, error);
      throw error;
    }
  }

  public async post<T>(endpoint: string, data: any): Promise<T> {
    const fullUrl = `${this._apiUrl}${endpoint}`;
    console.log(`🌐 POST Request: ${fullUrl}`);
    console.log(`📤 POST Body:`, data);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log(`📡 POST Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ POST Error Response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ POST Success:`, result);
      
      return result;
    } catch (error) {
      console.error(`❌ Error en POST ${endpoint}:`, error);
      throw error;
    }
  }

  public async put<T>(endpoint: string, data: any): Promise<T> {
    const fullUrl = `${this._apiUrl}${endpoint}`;
    console.log(`🌐 PUT Request: ${fullUrl}`);
    console.log(`📤 PUT Body:`, data);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log(`📡 PUT Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ PUT Error Response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ PUT Success:`, result);
      
      return result;
    } catch (error) {
      console.error(`❌ Error en PUT ${endpoint}:`, error);
      throw error;
    }
  }

  public async delete<T>(endpoint: string): Promise<T> {
    const fullUrl = `${this._apiUrl}${endpoint}`;
    console.log(`🌐 DELETE Request: ${fullUrl}`);
    
    try {
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`📡 DELETE Response Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ DELETE Error Response:`, errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ DELETE Success:`, result);
      
      return result;
    } catch (error) {
      console.error(`❌ Error en DELETE ${endpoint}:`, error);
      throw error;
    }
  }
}