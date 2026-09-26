import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './components/Home.jsx';
import { AdminPanel } from './components/AdminPanel.jsx';
import { ErrorPage } from './components/ErrorPage.jsx';
import LoginPage from './components/LoginPage.jsx';
import { GroupSelector } from './components/GroupSelector.jsx';
import { FolioTable } from './components/FolioTable.jsx';
import { PDFVisualizer } from './components/PDFVisualizer.jsx'
import { PDFPageInfoEdit } from './components/PDFPageInfoEdit.jsx'
import { PrivateRoutes } from './components/PrivateRoutes.jsx';
import { AuthProvider } from './components/AuthProvider.jsx';
import { DatosGrupoProvider } from './components/contexts/grupoContext.jsx';
import { GroupSelectorRenamer } from './components/GroupSelectorRenamer.jsx';
import PredicacionEditor from './components/PredicacionEditor.jsx';
import PredicacionView from './components/PredicacionView.jsx';
import { PendingApproval } from './components/PendingApproval.jsx';

function App() {

  return (
    <>
      <AuthProvider>
          <DatosGrupoProvider>
            <BrowserRouter>
              <Routes>

                <Route path='/pending-approval' element={<PendingApproval/>} />

                <Route path="/" element={<PrivateRoutes/>}>
                  <Route index element={<Home/>}/>
                  <Route path='home' element={<Home/>}/>
                  <Route path='/predicacion' element={<PredicacionView/>}/>
                  <Route path='*' element={<ErrorPage/>}/>
                </Route>

                <Route path="/" element={<PrivateRoutes minRole='admin'/>}>
                  <Route path='/grupo' element={<GroupSelector/>}/>
                  <Route path='/foliotable' element={<FolioTable/>}/>
                  <Route path='/grouprenamer' element={<GroupSelectorRenamer/>}/>
                  <Route path='/pdfvisualizer' element={<PDFVisualizer/>}/>
                  <Route path='/pdfpageinfoedit' element={<PDFPageInfoEdit />} />
                  <Route path='/predicacioneditor' element={<PredicacionEditor/>}/>
                </Route>

                <Route path="/" element={<PrivateRoutes minRole='manager'/>}>
                  <Route path='/adminpanel' element={<AdminPanel/>}/>
                </Route>

                  <Route path='/login' element={<LoginPage/>}/>

              </Routes>
            </BrowserRouter>
          </DatosGrupoProvider>
      </AuthProvider>
    </>
  )
}

export default App
