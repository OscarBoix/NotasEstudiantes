# React + TypeScript + Vite + Jest

Para esta prueba técnica se ha usado el stack de React, TypeScript con Jest para los test, usando Vite para la configuración del proyecto.

Se ha usado ESLint como linter.

## App

La app muestra un formulario arriba que permite añadir un estudiante con su nota. Cuando se agrega, en una tabla se muestra la fila con el nombre y apellido, la nota y un botón para eliminar la entrada. Por último, también se muestra el promedio de todas las notas encima de la tabla. 

El formulario evitará que se envíe vacío o que se añadan dos notas para un mismo estudiante.

*La app se encuentra en el archivo App.tsx.*

Se ha utilizado Water.css en el archivo index.css para simplificar el estilo, y luego se han realizado ajustes manuales en el archivo App.css. Toda la app está centrada y se usa flex para un diseño responsive.

Se usa el hook useState para almacenar la información de los inputs y recoge el valor de los useState cuando quiere agregar una nueva nota a a la lista:
```ts
function App() {
  const [id, setId] = useState<number>(0)
  const [nombre, setNombre] = useState<string>('')
  const [apellido, setApellido] = useState<string>('')
  const [nota, setNota] = useState<string>('')

  const [sumaNotas, setSumaNotas] = useState<number>(0.0)
  const [listaNotas, setListaNotas] = useState<NotaEstudiante[]>([])
```
La lista también está hecha usando un useState, pero una lista del type NotaEstudiante, type creado para manejar las notas:

```ts
type NotaEstudiante = {
  id: number;
  nombre: string;
  apellido: string;
  nota: number;
}
```

### Formulario
El header es el que tiene el formulario para agregar estudiantes y sus notas.
En realidad, no se usa form, si no que  hay inputs y se usa el hook useState para almacenar la información de los inputs y recoge el valor de los useState cuando quiere agregar una nueva nota a a la lista. 

La lista también está hecha usando un useState, pero de una lista de NotaEstudiante que es el type que se ha creado para manejar las notas.

``` ts
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
```

### Tabla

Una tabla con los campos de Nombre, Nota y espacio para el botón de eliminar.
Se encarga de mapear la lista de notas y llamar a las filas:

```ts
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
```

### Fila

Una fila que muestra el nombre, apellido, nota y un botón para eliminar la entrada:

```ts
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
```

### Funciones
Para mantener la simplicidad del código, se han creado algunas funciones para apartar y reutilizar la lógica.
Estas funciones son *onAddNota()*, *onRemoveNota()*, *media()* y *soloLetras()*:

```ts
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

function soloLetras(s: string): string {
  return s.slice(0,15).replace(/[^a-zA-ZáéíóúüÁÉÍÓÚÜñÑ]/g, '')
}
```

## Tests: App.test.tsx

Por último, aquí se muestran los test que se han creado usando Jest que verifican que la App funcione correctamente:

  - renderiza la página
  - input nombre no permite más de 15 carácteres
  - input nombre únicamente permite letras del abecedario
  - input apellido no permite más de 15 carácteres
  - input apellido únicamente permite letras del abecedario
  - input nota actualiza correctamente el estado cuando se ingresa una nota válida
  - input nota no permite ingresar valores fuera de rango
  - input nota no permite más de dos decimales
  - input nota permite ingresar valores decimales válidos
  - input nota permite borrar el valor
  - agrega una nota a listaNotas          
  - no agregar una nota sin número a listaNotas
  - fila eliminafila
  - la media se calcula correctamente