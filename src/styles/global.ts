import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    border: 0;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    background-color: #fff;
    color: #333;
  }

  :root {
    --cor-primaria: #c02929;
    --cor-secundaria: #1d1d1c;
    --cor-destaque: #f39c12;
    --cor-texto: #fff;
    --cor-fundo: #333;
    --cor-fundo-secundaria: #fff;
  }

  .p-fileupload .p-fileupload .p-fileupload-buttonbar  {
    padding: .5rem
  }

  .p-card .p-card-body {
    padding: .5rem;
}

.p-5 {
    padding: 1rem !important;
}


.p-calendar-w-btn-right .p-datepicker-trigger .p-button{
  background-color: var(--cor-primaria) !important; /* Defina a cor que você deseja para o ícone */
  border-color: var(--cor-primaria) !important;
}

`;

export default GlobalStyle;
