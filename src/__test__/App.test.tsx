import '@testing-library/jest-dom'
import { render, fireEvent } from "@testing-library/react"
import App from "../App"
import { Fila } from "../App"

test("renderiza la página", () => {
    render(<App />)
    expect(true).toBeTruthy()
})

//Funcionalidad del form

test('input nombre no permite más de 15 carácteres', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Nombre') as HTMLInputElement;

  // Ingresar un valor largo
  fireEvent.change(input, { target: { value: 'abcdefghijklmnñop' } });

  // Verificar que el valor del input se haya recortado
  expect(input.value).toBe('abcdefghijklmnñ');
});

test('input nombre únicamente permite letras del abecedario', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Nombre') as HTMLInputElement;

  // Ingresar un valor con números y carácteres especiales
  fireEvent.change(input, { target: { value: 'abc123-+' } });

  // Verificar que el valor del input se haya actualizado
  expect(input.value).toBe('abc');
});

test('input apellido no permite más de 15 carácteres', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Apellido') as HTMLInputElement;

  // Ingresar un valor largo
  fireEvent.change(input, { target: { value: 'abcdefghijklmnñop' } });

  // Verificar que el valor del input se haya recortado
  expect(input.value).toBe('abcdefghijklmnñ');
});

test('input apellido únicamente permite letras del abecedario', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Nombre') as HTMLInputElement;

  // Ingresar un valor con números y carácteres especiales
  fireEvent.change(input, { target: { value: 'abc123-+' } });

  // Verificar que el valor del input se haya actualizado
  expect(input.value).toBe('abc');
});

test('input nota actualiza correctamente el estado cuando se ingresa una nota válida', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Nota') as HTMLInputElement;

  // Ingresar un valor válido
  fireEvent.change(input, { target: { value: '8.5' } });

  // Verificar que el valor del input se haya actualizado
  expect(input.value).toBe('8.5');
});

test('input nota no permite ingresar valores fuera de rango', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Nota') as HTMLInputElement;

  // Ingresar un valor fuera del rango (por ejemplo, mayor a 10)
  fireEvent.change(input, { target: { value: '12' } });

  // Verificar que el valor no se ha actualizado
  expect(input.value).toBe('');
});

test('input nota no permite más de dos decimales', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Nota') as HTMLInputElement;

  // Ingresar un valor con más de dos decimales
  fireEvent.change(input, { target: { value: '5.123' } });

  // Verificar que el valor no se ha actualizado
  expect(input.value).toBe('5.12');
});

test('input nota permite ingresar valores decimales válidos', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Nota') as HTMLInputElement;

  // Ingresar un valor decimal válido
  fireEvent.change(input, { target: { value: '5.5' } });

  // Verificar que el valor se actualiza correctamente
  expect(input.value).toBe('5.5');
});

test('input nota permite borrar el valor', () => {
  const { getByLabelText } = render(<App />);
  
  const input = getByLabelText('Nota') as HTMLInputElement;

  // Ingresar un valor y luego borrarlo
  fireEvent.change(input, { target: { value: '7.5' } });
  fireEvent.change(input, { target: { value: '' } });

  // Verificar que el valor del input sea vacío
  expect(input.value).toBe('');
});

//Funcionalidad botones

test('agrega una nota a listaNotas', () => {
  const { getByLabelText, getByText } = render(<App />);

  // Datos inputs
  const nombreInput = getByLabelText('Nombre');
  const apellidoInput = getByLabelText('Apellido');
  const notaInput = getByLabelText('Nota');
  const agregarButton = getByText('Agregar Nota');

  fireEvent.change(nombreInput, { target: { value: 'Harold' } });
  fireEvent.change(apellidoInput, { target: { value: 'Cedeño' } });
  fireEvent.change(notaInput, { target: { value: '8.5' } });

  // Haz clic en el botón "Agregar Nota"
  fireEvent.click(agregarButton);

  // Verifica que la nueva nota se ha agregado a la lista
  expect(getByText('Harold Cedeño')).toBeInTheDocument();
});

test('no agregar una nota sin número a listaNotas', () => {
  const { getByLabelText, getByText, queryByText } = render(<App />);

  // Datos inputs
  const nombreInput = getByLabelText('Nombre');
  const apellidoInput = getByLabelText('Apellido');
  const notaInput = getByLabelText('Nota');
  const agregarButton = getByText('Agregar Nota');

  fireEvent.change(nombreInput, { target: { value: 'Harold' } });
  fireEvent.change(apellidoInput, { target: { value: 'Cedeño' } });
  fireEvent.change(notaInput, { target: { value: '' } });

  // Haz clic en el botón "Agregar Nota"
  fireEvent.click(agregarButton);

  // Verifica que la nueva nota se ha agregado a la lista
  expect(queryByText('Harold Cedeño')).not.toBeInTheDocument()
});

test('fila eliminafila', () => {
  const mockHandler = jest.fn();

  const { getByText } = render(
      <table>
      <tbody>
          <Fila
          key={0}  
          id={12}
          nombre="a"
          apellido="b"
          nota={4}
          onRemoveNota={mockHandler}
          />
      </tbody>
      </table>
  );

  const button = getByText('Eliminar');

  //Accionar el botón
  fireEvent.click(button);

  //Verificar que se llama la función eliminar
  expect(mockHandler).toHaveBeenCalledWith(12, 4);
});

//Funcionalidad media

test('la media se calcula correctamente', () => {
  const { getByLabelText, getByText } = render(<App />);

  // Datos inputs
  const nombreInput = getByLabelText('Nombre');
  const apellidoInput = getByLabelText('Apellido');
  const notaInput = getByLabelText('Nota');
  const agregarButton = getByText('Agregar Nota');

  fireEvent.change(nombreInput, { target: { value: 'Adrián' } });
  fireEvent.change(apellidoInput, { target: { value: 'Pérez' } });
  fireEvent.change(notaInput, { target: { value: '8' } });

  fireEvent.click(agregarButton);

  fireEvent.change(nombreInput, { target: { value: 'Sebastián' } });
  fireEvent.change(apellidoInput, { target: { value: 'Bertou' } });
  fireEvent.change(notaInput, { target: { value: '10' } });

  fireEvent.click(agregarButton);

  // Verifica que la nueva nota se ha agregado a la lista
  expect(getByText('9')).toBeInTheDocument();
});