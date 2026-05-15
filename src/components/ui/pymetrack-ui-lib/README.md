# Pymetrack UI Library 🎨

¡Bienvenida a la librería de componentes oficial de **Pymetrack**! Esta librería fue diseñada para ser independiente, ligera y fácil de integrar en cualquier proyecto de la plataforma (Dashboard, Repartidores, etc.).

## 🚀 Características
- **Componentes Basados en CSS:** Estilos independientes que no dependen de frameworks externos.
- **Formato JSX:** Máxima compatibilidad y simplicidad.
- **Accesibilidad:** Botones y elementos optimizados para dispositivos táctiles (mínimo 44px).
- **Interactividad:** Incluye estados de carga (loading), animaciones y tooltips.

## 📁 Estructura de la Librería
```text
pymetrack-ui-lib/
├── Button.jsx & Button.css       # Botones con variantes (primary, danger, success)
├── Input.jsx & Input.css         # Campos de texto estilizados
├── Card.jsx & Card.css           # Contenedores genéricos
├── Tooltip.jsx & Tooltip.css     # Mensajes flotantes con CSS puro
├── Modal.jsx & Modal.css         # Ventanas emergentes
└── theme.css                     # Variables globales de color y diseño
🛠️ Cómo usar un componente
Para usar estos componentes en cualquier parte del proyecto, solo importa el que necesites:

JavaScript
import Button from '@/components/ui/pymetrack-ui-lib/Button';

function MiComponente() {
  return (
    <Button variant="success" onClick={handleAction}>
      Aceptar Pedido
    </Button>
  );
}
✒️ Autor
Desarrollado con ❤️ por Catherine Godoy como parte de la modernización del ecosistema Pymetrack.