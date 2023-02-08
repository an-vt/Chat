import { UilTimes } from "@iconscout/react-unicons";
import { ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import styled from "styled-components";
import Portal from "./Portal";

interface Props {
  title?: string;
  visible: boolean;
  onClose: any;
  children: ReactNode;
  onCancel: () => void;
  onAdd: () => void;
  disabledBtnCancel?: boolean;
  disabledBtnAdd?: boolean;
  hideBtnAdd?: boolean;
  close?: boolean;
}

const Content = styled.div`
  min-width: 450px;
  background-color: #000;
  border-radius: 10px;
  position: relative;
  padding: 20px;

  .title {
    text-align: center;
    color: white;
  }

  .icon-close {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
  }

  .btn-cancel,
  .btn-add {
    background-color: unset;
    color: white;
    border: none;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
  }

  .btn-cancel:disabled,
  .btn-add:disabled {
    opacity: 0.6;
  }

  @media screen and (max-width: 767px) {
    width: calc(100vw - 40px);
    min-width: unset;
    padding: 15px;

    .btn-cancel {
      font-size: 16px;
    }

    .title {
      font-size: 22px;
    }
  }
`;

function Modal({
  visible,
  onClose,
  onCancel,
  onAdd,
  children,
  title = "",
  disabledBtnCancel = false,
  disabledBtnAdd = false,
  hideBtnAdd = false,
  close = false,
}: Props) {
  const getOpacityChecked = (
    _hideBtnAdd: boolean,
    _disabledBtnAdd: boolean,
  ): string => {
    if (_hideBtnAdd) {
      return "0";
    }
    return _disabledBtnAdd ? "0.6" : "1";
  };

  return (
    <CSSTransition in={visible} timeout={250} classNames="zoom" unmountOnExit>
      {(status) => (
        <Portal
          visible={status !== "exited"}
          onClose={onClose}
          bodyStyle={{ transition: "all 250ms" }}
        >
          <Content>
            <div className="header">
              <button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
                disabled={disabledBtnCancel}
              >
                Cancel
              </button>
              {title && <h2 className="title">{title}</h2>}
              <button
                type="button"
                className="btn-add"
                onClick={onAdd}
                disabled={disabledBtnAdd}
                style={{
                  opacity: getOpacityChecked(hideBtnAdd, disabledBtnAdd),
                  cursor: hideBtnAdd ? "unset" : "pointer",
                  transition: "opacity 0.3s ease-out",
                }}
              >
                Create
              </button>
            </div>
            {close && (
              <UilTimes
                color="#fff"
                size={25}
                onClick={onClose}
                className="icon-close"
              />
            )}
            {children}
          </Content>
        </Portal>
      )}
    </CSSTransition>
  );
}

export default Modal;
