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

const StyledToggleButton = styled(Button)<{ $visible: boolean }>`
  color: #64748b !important;
  background: transparent !important;
  border: none !important;
  border-radius: 50% !important;
  width: 36px !important;
  height: 36px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
  cursor: pointer !important;
  margin: ${props => props.$visible ? "0" : "0 auto"} !important;

  &:hover {
    background: rgba(192, 41, 41, 0.08) !important;
    color: var(--cor-primaria) !important;
    transform: scale(1.15) !important;
  }

  &:active {
    transform: scale(0.95) !important;
  }
`;

function LeftPanel({ children }: LeftPanelProps) {
  const [visible, setVisible] = useState(true);
  const [visibleConfirmation, setVisibleConfirmation] = useState(false);
  const { logout } = useContext(AuthContext);

  return (
    <StyledSidebar
      style={{
        flex: `0 0 ${visible ? "300px" : "70px"}`,
      }}
    >
      <div className="gap-5">
        <div className="flex items-center justify-between w-full mb-4 px-2" style={{ gap: "10px" }}>
          {visible && <Logo />}
          <StyledToggleButton
            $visible={visible}
            className={visible ? "pi pi-angle-left" : "pi pi-angle-right"}
            onClick={() => setVisible(!visible)}
          />
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
