import { Logo } from "@/views/common";
import { Button } from "primereact/button";
import PropTypes from "prop-types";
import { ReactNode, useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "@/context/AuthContext";
import ConfirmationDialog from "../ConfirmationDialog";

interface LeftPanelProps {
  children: ReactNode;
}

const StyledSidebar = styled.aside<LeftPanelProps>`
  flex: 0 0 250px;
  color: var(--cor-fundo);
  font-weight: 400;
  gap: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; // Impede que o conteúdo visível quando retraído vaze
  transition: flex 0.5s; // Adiciona uma transição suave
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.2);
`;

function LeftPanel({ children }: LeftPanelProps) {
  const [visible, setVisible] = useState(true);
  const [visibleConfirmation, setVisibleConfirmation] = useState(false);
  const { logout } = useContext(AuthContext);

  function teste() {
    console.log("teste");
  }
  return (
    <StyledSidebar
      style={{
        flex: `0 0 ${visible ? "300px" : "70px"}`,
      }}
    >
      <div className="gap-5">
        <div className="flex items-center justify-center">
          {visible && <Logo />}
          <Button
            className={visible ? "pi pi-arrow-left" : "pi pi-arrow-right"}
            onClick={() => setVisible(!visible)}
            style={{
              color: "black",
              background: "transparent",
              border: "transparent",
              outline: "none",
            }}
          ></Button>
        </div>
        {visible && <>{children}</>}
      </div>
      {visible && (
        <Button
          type="submit"
          severity="danger"
          icon="pi pi-sign-out"
          onClick={logout}
          label="Sair"
        />
      )}
    </StyledSidebar>
  );
}

LeftPanel.propTypes = {
  children: PropTypes.node,
};

export default LeftPanel;
