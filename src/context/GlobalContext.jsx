import React, { createContext } from "react";
import { MascotasProvider } from "./MascotasContext";
import { VacunasProvider } from "./VacunasContext";
import { UsuariosProvider } from "./UsuariosContext";
import { RazasProvider } from "./RazasContext";
import { MunicipiosProvider } from "./MunicipiosContext";
import { DepartamentosProvider } from "./DepartamentosContext";
import { AdopcionesProvider } from "./AdopcionesContext";
import { CategoriasProvider } from "./CategoriaContext";
import { SidebarProvider } from "./SidebarContext";

export const GlobalContext = createContext();

const GlobalProvider = ({ children }) => {
  const globalContextValue = {};

  return (
    <GlobalContext.Provider value={globalContextValue}>
      <SidebarProvider>
        <MascotasProvider>
          <VacunasProvider>
            <UsuariosProvider>
              <RazasProvider>
                <MunicipiosProvider>
                  <DepartamentosProvider>
                    <AdopcionesProvider>
                      <CategoriasProvider>{children}</CategoriasProvider>
                    </AdopcionesProvider>
                  </DepartamentosProvider>
                </MunicipiosProvider>
              </RazasProvider>
            </UsuariosProvider>
          </VacunasProvider>
        </MascotasProvider>
      </SidebarProvider>
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
