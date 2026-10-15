import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { computed, signal } from '@angular/core';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css',
})
export class ClienteComponent implements OnInit {
  clienteService: ClienteService;
  readonly clientes = signal<Cliente[]>([]);
  readonly carregando = signal(true);
  readonly falhou = signal(false);
  readonly buscandoPorId = signal(false);
  readonly buscaAtiva = signal(false);
  readonly clienteBuscado = signal<Cliente | null>(null);
  idBusca = signal<string>('');
  readonly modoEdicao = signal(false);
  readonly formularioAberto = signal(false);
  clienteForm: Cliente = { id: '', nome: '', endereco: '' };

  readonly clientesExibidos = computed(() => {
    if (this.buscaAtiva()) {
      const cliente = this.clienteBuscado();
      return cliente ? [cliente] : [];
    }
    return this.clientes();
  });

  constructor(clienteService: ClienteService) {
    this.clienteService = clienteService;
  }

  ngOnInit() {
    this.carregar();
  }

  protected salvarCliente(): void {
    const operacao = this.modoEdicao()
      ? this.clienteService.editarCliente(this.clienteForm.id, this.clienteForm)
      : this.clienteService.criarCliente(this.clienteForm);

    operacao.subscribe({
      next: () => {
        this.cancelarFormulario();
        this.carregar();
      },
      error: (error: any) => {
        this.falhou.set(true);
      }
    });
  }

  protected carregar(): void {
    this.clienteService.listarTodos().subscribe({
      next: (clientes: Cliente[]) => {
        this.clientes.set(clientes);
        this.carregando.set(false);
      },
    });
  }

  protected buscarPorId(): void {
    this.buscaAtiva.set(true);
    this.clienteBuscado.set(null);
    this.buscandoPorId.set(true);
    this.clienteService.buscarClientePorId(this.idBusca()).subscribe({
      next: (cliente: Cliente) => {
        this.clienteBuscado.set(cliente);
        this.buscandoPorId.set(false);
      },
      error: (error: any) => {
        this.clienteBuscado.set(null);
        this.buscandoPorId.set(false);
      }
    });
  }

  protected excluirCliente(id: string): void {
    this.clienteService.deletarCliente(id).subscribe({
      next: () => {
        if (this.clienteBuscado()?.id === id) {
          this.limparBusca();
        }
        this.carregar();
      },
      error: (error: any) => {
        this.falhou.set(true);
      }
    });
  }

  protected abrirNovoCliente(): void {
    this.modoEdicao.set(false);
    this.clienteForm = { id: '', nome: '', endereco: '' };
    this.formularioAberto.set(true);
  }

  protected editarCliente(cliente: Cliente): void {
    this.modoEdicao.set(true);
    this.clienteForm = { ...cliente };
    this.formularioAberto.set(true);
  }

  protected cancelarFormulario(): void {
    this.formularioAberto.set(false);
    this.modoEdicao.set(false);
    this.clienteForm = { id: '', nome: '', endereco: '' };
  }

  limparBusca(): void {
    this.idBusca.set('');
    this.clienteBuscado.set(null);
    this.buscandoPorId.set(false);
    this.buscaAtiva.set(false);
  }
}
