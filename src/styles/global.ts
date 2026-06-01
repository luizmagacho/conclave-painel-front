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
    background-color: #f8fafc;
    color: #1e293b;
    -webkit-font-smoothing: antialiased;
  }

  :root {
    /* PrimeReact Core Theme Overrides (Zero Blue) */
    --primary-color: #c02929 !important;
    --primary-color-text: #ffffff !important;
    --highlight-bg: #fff5f5 !important;
    --highlight-text-color: #c02929 !important;
    --primary-50: #fff5f5 !important;
    --primary-100: #fed7d7 !important;
    --primary-200: #feb2b2 !important;
    --primary-300: #fc8181 !important;
    --primary-400: #f56565 !important;
    --primary-500: #c02929 !important;
    --primary-600: #a82020 !important;
    --primary-700: #9b2c2c !important;
    --primary-800: #742a2a !important;
    --primary-900: #5c2323 !important;

    --cor-primaria: #c02929;
    --cor-primaria-hover: #a82020;
    --cor-primaria-soft: rgba(192, 41, 41, 0.15);
    --cor-primaria-light: #fff5f5;
    --cor-secundaria: #1d1d1c;
    --cor-destaque: #f39c12;
    --cor-texto: #fff;
    --cor-fundo: #333;
    --cor-fundo-secundaria: #fff;
    --border-radius-m: 10px;
    --border-radius-s: 6px;
    --shadow-soft: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.03);
    --shadow-dialog: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
  }

  /* ── Remove Default PrimeReact Focus Blue Rings & Outlines ── */
  .p-inputtext:enabled:focus,
  .p-inputnumber-input:enabled:focus,
  .p-chips-multiple-container:not(.p-disabled).p-focus,
  .p-dropdown:not(.p-disabled).p-focus,
  .p-autocomplete:not(.p-disabled).p-focus .p-autocomplete-input,
  .p-autocomplete-multiple-container:not(.p-disabled).p-focus,
  .p-calendar:not(.p-disabled).p-focus .p-inputtext {
    border-color: var(--cor-primaria) !important;
    box-shadow: 0 0 0 3px var(--cor-primaria-soft) !important;
    outline: none !important;
  }

  /* ── Global Card & Dialog Modernization ── */
  .p-dialog {
    border-radius: 12px !important;
    box-shadow: var(--shadow-dialog) !important;
    border: 1px solid #e2e8f0 !important;
    overflow: hidden;
  }

  .p-dialog .p-dialog-header {
    background-color: #fff !important;
    padding: 1.25rem 1.5rem 1rem 1.5rem !important;
    border-bottom: 1px solid #f1f5f9 !important;
  }

  .p-dialog .p-dialog-content {
    background-color: #fff !important;
    padding: 1.5rem !important;
  }

  .p-dialog .p-dialog-footer {
    background-color: #fff !important;
    padding: 1rem 1.5rem 1.25rem 1.5rem !important;
    border-top: 1px solid #f1f5f9 !important;
  }

  .p-dialog-mask {
    backdrop-filter: blur(6px) !important;
    background-color: rgba(15, 23, 42, 0.35) !important;
  }

  /* ── AutoComplete & Dropdown Drop-down Panel Styling (Zero Blue) ── */
  .p-autocomplete-panel,
  .p-dropdown-panel {
    border-radius: 8px !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: var(--shadow-soft) !important;
    padding: 0.25rem 0 !important;
  }

  .p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item.p-highlight,
  .p-dropdown-panel .p-dropdown-items .p-dropdown-item.p-highlight {
    background-color: var(--cor-primaria-light) !important;
    color: var(--cor-primaria) !important;
    font-weight: 600 !important;
  }

  .p-autocomplete-panel .p-autocomplete-items .p-autocomplete-item:not(.p-highlight):hover,
  .p-dropdown-panel .p-dropdown-items .p-dropdown-item:not(.p-highlight):hover {
    background-color: #f8fafc !important;
    color: #0f172a !important;
  }

  /* ── Overwriting Dropdowns & AutoCompletes Trigger Buttons (Zero Blue) ── */
  .p-autocomplete .p-autocomplete-dropdown,
  .p-dropdown .p-dropdown-trigger {
    background-color: var(--cor-primaria) !important;
    border-color: var(--cor-primaria) !important;
    color: #ffffff !important;
  }
  .p-autocomplete .p-autocomplete-dropdown:hover,
  .p-dropdown .p-dropdown-trigger:hover {
    background-color: var(--cor-primaria-hover) !important;
    border-color: var(--cor-primaria-hover) !important;
  }

  /* ── Checkboxes (Zero Blue) ── */
  .p-checkbox:not(.p-disabled) .p-checkbox-box.p-focus {
    border-color: var(--cor-primaria) !important;
    box-shadow: 0 0 0 3px var(--cor-primaria-soft) !important;
  }

  .p-checkbox .p-checkbox-box.p-highlight {
    background-color: var(--cor-primaria) !important;
    border-color: var(--cor-primaria) !important;
  }

  .p-checkbox:not(.p-disabled) .p-checkbox-box.p-highlight:hover {
    background-color: var(--cor-primaria-hover) !important;
    border-color: var(--cor-primaria-hover) !important;
  }

  /* ── RadioButtons (Zero Blue) ── */
  .p-radiobutton:not(.p-disabled) .p-radiobutton-box.p-focus {
    border-color: var(--cor-primaria) !important;
    box-shadow: 0 0 0 3px var(--cor-primaria-soft) !important;
  }

  .p-radiobutton .p-radiobutton-box.p-highlight {
    background-color: var(--cor-primaria) !important;
    border-color: var(--cor-primaria) !important;
  }

  .p-radiobutton .p-radiobutton-box.p-highlight:hover {
    background-color: var(--cor-primaria-hover) !important;
    border-color: var(--cor-primaria-hover) !important;
  }

  .p-radiobutton .p-radiobutton-box .p-radiobutton-icon {
    background-color: #ffffff !important;
  }

  /* ── SelectButton (Zero Blue) ── */
  .p-selectbutton {
    gap: 4px;
    background-color: #f1f5f9;
    padding: 3px;
    border-radius: 8px;
    width: fit-content;
  }

  .p-selectbutton .p-button {
    background-color: transparent !important;
    color: #475569 !important;
    border: none !important;
    border-radius: 6px !important;
    font-size: 0.8rem !important;
    padding: 6px 16px !important;
    font-weight: 600 !important;
    transition: all 0.15s ease-in-out !important;
  }

  .p-selectbutton .p-button.p-highlight {
    background-color: #fff !important;
    color: var(--cor-primaria) !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  }

  .p-selectbutton .p-button.p-highlight:hover {
    background-color: #fff !important;
    color: var(--cor-primaria-hover) !important;
  }

  .p-selectbutton .p-button:focus {
    box-shadow: none !important;
  }

  /* ── Custom Styled Premium Buttons & Transitions ── */
  .p-button {
    font-weight: 600 !important;
    border-radius: 8px !important;
    font-size: 0.88rem !important;
    letter-spacing: 0.02em !important;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
    box-shadow: 0 2px 4px rgba(192, 41, 41, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 8px !important;
  }

  /* Hover micro-interaction: subtle lift, deeper warm red shadow */
  .p-button:enabled:hover {
    transform: translateY(-1px) !important;
    box-shadow: 0 6px 12px rgba(192, 41, 41, 0.16), 0 2px 4px rgba(0, 0, 0, 0.06) !important;
    filter: brightness(1.05) !important;
  }

  /* Active/Click micro-interaction: slight depress */
  .p-button:enabled:active {
    transform: translateY(1px) !important;
    box-shadow: 0 2px 4px rgba(192, 41, 41, 0.06) !important;
  }

  /* Primary Button Styling (Zero Blue, Brand Crimson Gradient) */
  .p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-link):not(.p-button-secondary):not(.p-button-success):not(.p-button-info):not(.p-button-warning):not(.p-button-help):not(.p-button-danger) {
    background: linear-gradient(180deg, #c02929 0%, #a82020 100%) !important;
    color: #ffffff !important;
    border: 1px solid #9b2c2c !important;
  }
  .p-button:not(.p-button-outlined):not(.p-button-text):not(.p-button-link):not(.p-button-secondary):not(.p-button-success):not(.p-button-info):not(.p-button-warning):not(.p-button-help):not(.p-button-danger):enabled:hover {
    background: linear-gradient(180deg, #cb3232 0%, #b22626 100%) !important;
  }

  /* Outlined Button - Elegant glass border, soft crimson hover overlay */
  .p-button.p-button-outlined {
    border: 1.5px solid rgba(192, 41, 41, 0.4) !important;
    color: var(--cor-primaria) !important;
    background: transparent !important;
    box-shadow: none !important;
  }

  .p-button.p-button-outlined:enabled:hover {
    background: var(--cor-primaria-light) !important;
    color: var(--cor-primaria-hover) !important;
    border-color: var(--cor-primaria-hover) !important;
    box-shadow: 0 4px 10px var(--cor-primaria-soft) !important;
  }

  /* Danger Button Overrides */
  .p-button.p-button-danger,
  .p-button.p-button-severity-danger {
    background: linear-gradient(180deg, #e53e3e 0%, #c53030 100%) !important;
    border: 1px solid #b83232 !important;
    color: #fff !important;
  }
  
  .p-button.p-button-danger:enabled:hover,
  .p-button.p-button-severity-danger:enabled:hover {
    background: linear-gradient(180deg, #f56565 0%, #e53e3e 100%) !important;
  }

  /* Link buttons (like "Esqueci a senha" or "Tentar novamente") */
  .p-button.p-button-link {
    background: transparent !important;
    border: none !important;
    color: var(--cor-primaria) !important;
    box-shadow: none !important;
    padding: 4px 8px !important;
    font-size: 0.85rem !important;
  }
  
  .p-button.p-button-link:enabled:hover {
    color: var(--cor-primaria-hover) !important;
    background: var(--cor-primaria-light) !important;
    transform: none !important;
    box-shadow: none !important;
    border-radius: 6px !important;
  }

  /* ── Calendar & Datepicker styling (Zero Blue) ── */
  .p-datepicker {
    border-radius: 8px !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: var(--shadow-dialog) !important;
    padding: 0.75rem !important;
  }

  .p-datepicker table td > span.p-highlight {
    background-color: var(--cor-primaria) !important;
    color: #fff !important;
  }

  .p-datepicker table td.p-datepicker-today > span {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
    border: 1px dashed var(--cor-primaria) !important;
  }

  .p-datepicker table td > span:not(.p-disabled):not(.p-highlight):hover {
    background-color: var(--cor-primaria-light) !important;
    color: var(--cor-primaria) !important;
  }

  .p-datepicker-trigger {
    background-color: var(--cor-primaria) !important;
    border-color: var(--cor-primaria) !important;
    color: #fff !important;
  }

  .p-datepicker-trigger:hover {
    background-color: var(--cor-primaria-hover) !important;
    border-color: var(--cor-primaria-hover) !important;
  }

  .p-calendar-w-btn-right .p-datepicker-trigger .p-button {
    background-color: var(--cor-primaria) !important;
    border-color: var(--cor-primaria) !important;
  }

  /* ── Modern Premium Data Tables (Fintech Benchmark) ── */
  .p-datatable {
    border-radius: 12px !important;
    overflow: hidden !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.02) !important;
    background: #ffffff !important;
    display: flex;
    flex-direction: column;
  }

  .p-datatable .p-datatable-wrapper {
    flex: 1 1 0%;
    overflow-y: auto;
  }

  /* Make gridlines minimalist horizontal lines only */
  .p-datatable.p-datatable-gridlines .p-datatable-thead > tr > th,
  .p-datatable.p-datatable-gridlines .p-datatable-tbody > tr > td,
  .p-datatable.p-datatable-gridlines .p-datatable-tfoot > tr > td {
    border-width: 0 0 1px 0 !important;
    border-color: #f1f5f9 !important;
  }

  .p-datatable .p-datatable-thead > tr > th {
    background-color: #f8fafc !important;
    color: #475569 !important;
    font-weight: 600 !important;
    font-size: 0.78rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    border-bottom: 2px solid #edf2f7 !important;
    padding: 14px 18px !important;
    transition: background-color 0.15s ease !important;
  }

  .p-datatable .p-datatable-tbody > tr {
    background-color: #ffffff !important;
    transition: all 0.2s ease-in-out !important;
  }

  .p-datatable.p-datatable-striped .p-datatable-tbody > tr:nth-child(even) {
    background-color: #fcfdfe !important;
  }

  /* Hover: subtle warm light rose highlight */
  .p-datatable .p-datatable-tbody > tr:hover {
    background-color: rgba(192, 41, 41, 0.02) !important;
  }

  .p-datatable .p-datatable-tbody > tr > td {
    padding: 12px 18px !important;
    border-bottom: 1px solid #f1f5f9 !important;
    color: #334155 !important;
    vertical-align: middle !important;
  }

  /* Minimalist Circular Table Row Actions */
  .p-datatable .p-datatable-tbody > tr td button.p-button-text {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
    padding: 0 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: #64748b !important; /* Soft minimalist gray default icon */
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
  }

  /* Specific Edit Hover styles */
  .p-datatable .p-datatable-tbody > tr td button.p-button-text[tooltip="Editar"]:hover,
  .p-datatable .p-datatable-tbody > tr td button.p-button-text:not(.p-button-danger):not(.p-button-severity-danger):hover {
    background: rgba(192, 41, 41, 0.08) !important;
    color: var(--cor-primaria) !important;
    transform: scale(1.12) !important;
  }

  /* Specific Delete Hover styles */
  .p-datatable .p-datatable-tbody > tr td button.p-button-text.p-button-danger:hover,
  .p-datatable .p-datatable-tbody > tr td button.p-button-text.p-button-severity-danger:hover,
  .p-datatable .p-datatable-tbody > tr td button.p-button-text[tooltip="Excluir"]:hover {
    background: rgba(239, 68, 68, 0.08) !important;
    color: #ef4444 !important;
    transform: scale(1.12) !important;
  }

  .p-datatable .p-datatable-tbody > tr td button.p-button-text:active {
    transform: scale(0.92) !important;
  }

  /* Emerald green minimalist checkmark */
  .p-datatable .p-datatable-tbody > tr td i.pi-check-circle {
    color: #10b981 !important; /* Rich emerald green */
    font-size: 1.1rem !important;
  }

  /* Paginator styling */
  .p-paginator {
    background-color: transparent !important;
    border: none !important;
    padding: 1rem 0 !important;
  }

  .p-paginator .p-paginator-pages .p-paginator-page {
    border-radius: 6px !important;
    min-width: 32px !important;
    height: 32px !important;
    font-size: 0.82rem !important;
    transition: all 0.15s !important;
  }

  .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
    background-color: var(--cor-primaria) !important;
    color: #fff !important;
    font-weight: 700 !important;
  }

  .p-paginator .p-paginator-pages .p-paginator-page:not(.p-highlight):hover {
    background-color: #e2e8f0 !important;
  }

  /* Utility styling */
  .smaller-text {
    font-size: 0.75rem;
  }

  .p-tabview .p-tabview-panels {
    padding: 0.5rem;
  }

  /* ── Custom Premium Sidebar Navigation (Zero Refreshes, Infinite State Highlight) ── */
  .custom-sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }

  .custom-sidebar-section-title {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    padding: 12px 12px 6px 12px;
  }

  .custom-sidebar-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  /* Hover micro-interaction: smooth slide and soft pink backdrop */
  .custom-sidebar-item:hover {
    background: rgba(192, 41, 41, 0.05);
    color: var(--cor-primaria-hover);
    padding-left: 20px; /* Elegant slide right on hover */
  }

  .custom-sidebar-item:hover i {
    color: var(--cor-primaria-hover);
  }

  /* Active Selected State: Premium Brand Crimson Red Gradient with drop shadow */
  .custom-sidebar-item.active {
    background: linear-gradient(180deg, #c02929 0%, #a82020 100%) !important;
    color: #ffffff !important;
    box-shadow: 0 4px 12px rgba(192, 41, 41, 0.25) !important;
    border: 1px solid #9b2c2c !important;
  }

  .custom-sidebar-item.active i {
    color: #ffffff !important;
  }

  /* ── Premium Filter Bar Styling ── */
  .premium-filter-bar {
    background: #ffffff !important;
    border: 1px solid #f1f5f9 !important;
    border-radius: 12px !important;
    padding: 16px 20px !important;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05) !important;
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 0px !important;
    align-items: flex-end !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  
  .premium-filter-bar.grid {
    margin: 0 -6px !important;
  }
  
  .premium-filter-bar .field {
    margin-bottom: 0 !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 6px !important;
    padding: 0 6px !important;
  }

  .premium-filter-bar .p-inputtext,
  .premium-filter-bar .p-autocomplete-input {
    border-radius: 8px !important;
    border: 1px solid #e2e8f0 !important;
    font-size: 0.85rem !important;
    padding: 8px 12px !important;
    height: 38px !important;
    background-color: #f8fafc !important;
    transition: all 0.2s ease-in-out !important;
  }
  
  .premium-filter-bar .p-inputtext:hover,
  .premium-filter-bar .p-autocomplete-input:hover {
    border-color: #cbd5e1 !important;
    background-color: #ffffff !important;
  }

  .premium-filter-bar .p-inputtext:focus,
  .premium-filter-bar .p-autocomplete-input:focus {
    border-color: var(--cor-primaria) !important;
    background-color: #ffffff !important;
    box-shadow: 0 0 0 3px var(--cor-primaria-soft) !important;
  }

  /* Make datepicker match premium filters */
  .premium-filter-bar .p-calendar {
    width: 100% !important;
  }
  
  .premium-filter-bar .p-calendar .p-inputtext {
    border-radius: 8px !important;
    border: 1px solid #e2e8f0 !important;
    width: 100% !important;
  }
  
  .premium-filter-bar .p-icon-field {
    width: 100% !important;
  }

  .premium-filter-bar .p-icon-field .p-inputtext,
  .premium-filter-bar .p-input-icon-left .p-inputtext {
    padding-left: 2.5rem !important;
  }
  
  .premium-filter-bar .p-icon-field .p-inputicon {
    color: #94a3b8 !important;
  }
`;

export default GlobalStyle;
