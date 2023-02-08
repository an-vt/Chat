import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

function createPortalWrapper() {
  const element = document.createElement("div");
  element.id = "portal-wrapper";
  return element;
}

const Container = styled.div`
  position: fixed;
  z-index: 9999;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: "#6d7b89";
  opacity: 0.6;
`;

const PortalContent = styled.div`
  position: relative;
  border-radius: 15px;
`;

interface Props {
  bodyStyle: any;
  onClose: any;
  visible: boolean;
  children: ReactNode;
  overlay?: boolean;
}

const portalWrapperElm = createPortalWrapper();
const Portal = ({ bodyStyle, onClose, overlay, children }: Props) => {
  useEffect(() => {
    document.body.appendChild(portalWrapperElm);
  }, []);
  const renderContent = (
    <Container>
      {overlay && (
        <Overlay
          role="button"
          tabIndex={0}
          className="overlay"
          onClick={onClose}
          onKeyDown={() => console.log("abcd")}
        >
          {}
        </Overlay>
      )}
      <PortalContent style={bodyStyle}>{children}</PortalContent>
    </Container>
  );
  return createPortal(renderContent, portalWrapperElm);
};

export default Portal;
