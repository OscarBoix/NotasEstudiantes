import { useState } from 'react'
import './App.css'

//Tipos
type NotaEstudiante = {
  id: number;
  nombre: string;
  apellido: string;
  nota: number;
}

type OnRemoveNota = (id: number, nota: number) => void;

//Componentes
function Tabla({notas, onRemoveNota} : {notas: NotaEstudiante[]} & {onRemoveNota: OnRemoveNota}) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Nota</th>
          <th/>
        </tr>
      </thead>
      <tbody>
        {notas.map(entrada => (
          <Fila 
            key={entrada.id}
            id={entrada.id}
            nombre={entrada.nombre}
            apellido={entrada.apellido}
            nota={entrada.nota}
            onRemoveNota={onRemoveNota}
          />
        ))}
      </tbody>
    </table>
  )
}

export function Fila({id, nombre, apellido , nota, onRemoveNota}: NotaEstudiante & {onRemoveNota: OnRemoveNota}) {
  return (
    <tr>
      <td>{nombre+' '+apellido}</td>
      <td>{nota}</td>
      <td>
        <button onClick={() => {
          onRemoveNota(id, nota);
        }}>Eliminar</button>
      </td>
    </tr>
  )
}

function App() {
  const [id, setId] = useState<number>(0)
  const [nombre, setNombre] = useState<string>('')
  const [apellido, setApellido] = useState<string>('')
  const [nota, setNota] = useState<string>('')

  const [sumaNotas, setSumaNotas] = useState<number>(0.0)
  const [listaNotas, setListaNotas] = useState<NotaEstudiante[]>([])

  //Añadir nota a la lista, actualizar media y vaciar campos de input
  function onAddNota() {
    const notaFloat= parseFloat(nota);
      if(nombre!='' && apellido!='') {
        if(nota!='') {
          if (!(listaNotas.find((nota) => nota.nombre === nombre && nota.apellido === apellido))) {
            setListaNotas([
              ...listaNotas,
              { id:id, nombre: nombre, apellido: apellido, nota: notaFloat }
            ]);
            setId(id+1);
            setSumaNotas(sumaNotas + notaFloat);
            setNombre('')
            setApellido('')
            setNota('')
          } else {
            alert(`'${nombre + ' ' + apellido}' ya se encuentra en la lista`);
          }
        } else {
          alert(`La nota necesita un valor`);
        }
      } else {
        alert(`El nombre y/o apellido están vacios`);
      }
  }

  //Eliminar nota de la lista y actualizar media
  function onRemoveNota(id: number, nota:number) {
    const nuevasNotas = listaNotas.filter((nota) => nota.id !== id);
    setListaNotas(nuevasNotas);
    setSumaNotas(sumaNotas-nota)
  }

  function media(sumaNotas: number, cantidadNotas: number): number {
    if (cantidadNotas === 0) {
      return 0;
    }
    return parseFloat((sumaNotas / cantidadNotas).toFixed(2));
  }

  //Función que recibe string y devuelve solo con letras del abecedario español
  function soloLetras(s: string): string {
    return s.slice(0,15).replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]/g, '')
  }

  return (
    <div className='page'>
      <header>
        <h1>Notas estudiantes</h1>
        <div className='form'>
          <label>
            Nombre
            <input 
              placeholder='Adrián' 
              value={nombre}
              onChange={e => setNombre(soloLetras(e.target.value))}
            />
          </label>
          <label>
            Apellido
            <input 
              placeholder='Pérez' 
              value={apellido}
              onChange={e => setApellido(soloLetras(e.target.value))}
            />
          </label>
          <label>
            Nota
            <input 
              placeholder='' 
              value={nota}
              onChange={e => {
                //Recorta a 4 carácteres (0.00) y permite únicamente números entre 0 y 10, con dos décimas
                const input = e.target.value.slice(0,4);

                if (/^\d*\.?\d{0,2}$/.test(input)) {
                  const notaFloat = parseFloat(input);
  
                  if ((notaFloat >= 0 && notaFloat <= 10) || Number.isNaN(notaFloat)) {
                    setNota(input);
                  }
                }
              }}
            />
          </label>
          <button 
            onClick={() => {
              onAddNota();
            }}
            >
              Agregar Nota
          </button>
        </div>
      </header>

      <main>
        <p>El promedio es de <u>{media(sumaNotas, listaNotas.length)}</u></p>
        <Tabla
          notas={listaNotas}
          onRemoveNota={onRemoveNota}
        />
      </main>
    </div>
  )
}

export default App
