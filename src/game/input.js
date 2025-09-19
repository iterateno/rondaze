export function createInputHandlers(spacecraft, isTutorial, isMobile = false) {
  let arrowUpPressed = false;
  let leftPressed = false;
  let rightPressed = false;

  function handleKeyDown(event) {
    // Prevent Enter key from being processed in tutorial mode
    if (isTutorial && (event.code === "Enter" || event.key === "Enter")) {
      // Ignore Enter key in tutorial mode
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    switch (event.code) {
      case "ArrowLeft":
        if (!leftPressed) {
          leftPressed = true;
          spacecraft.angular_velocity -= 0.01;
        }
        break;
      case "ArrowRight":
        if (!rightPressed) {
          rightPressed = true;
          spacecraft.angular_velocity += 0.01;
        }
        break;
      case "ArrowUp":
        arrowUpPressed = true;
        break;
      case "ArrowDown":
        spacecraft.speed -= 0.1;
        break;
      case "Space":
        // In tutorial, prevent spacebar from triggering other events
        if (isTutorial) {
          event.stopPropagation();
        }
        // Prevent default to avoid page scrolling on mobile browsers
        event.preventDefault();
        return true; // Signal that a nuke should be fired
      case "KeyP":
      case "p":
        return "togglePause"; // Signal that game should be paused
      default:
        break;
    }
    return false;
  }

  function handleKeyUp(event) {
    switch (event.code) {
      case "ArrowUp":
        arrowUpPressed = false;
        break;
      case "ArrowLeft":
        leftPressed = false;
        break;
      case "ArrowRight":
        rightPressed = false;
        break;
    }
  }

  // Touch event handlers for mobile
  const touchHandlers = isMobile ? {
    handleTouchStart: (touchType) => {
      const event = new KeyboardEvent('keydown', {
        code: touchType,
        key: touchType,
        bubbles: true
      });
      return handleKeyDown(event);
    },
    
    handleTouchEnd: (touchType) => {
      const event = new KeyboardEvent('keyup', {
        code: touchType,
        key: touchType,
        bubbles: true
      });
      handleKeyUp(event);
    }
  } : {};

  return {
    handleKeyDown,
    handleKeyUp,
    isArrowUpPressed: () => arrowUpPressed,
    isLeftPressed: () => leftPressed,
    isRightPressed: () => rightPressed,
    ...touchHandlers
  };
} 