import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private URLBase = 'http://localhost:8080/api';

  criarCliente(cliente: Cliente): Observable<any> {
    return this.http.post(`${this.URLBase}/v1/cliente`, cliente, { responseType: 'text' });
  }

  listarTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.URLBase}/v1/cliente`);
  }

  buscarClientePorId(id: string): Observable<any> {
    return this.http.get(`${this.URLBase}/v1/cliente/${id}`);
  }

  deletarCliente(id: string): Observable<any> {
    return this.http.delete(`${this.URLBase}/v1/cliente/${id}`, { responseType: 'text' });
  }

  editarCliente(id: string, cliente: Cliente): Observable<any> {
    return this.http.put(`${this.URLBase}/v1/cliente/${id}`, cliente, { responseType: 'text' });
  }
}
