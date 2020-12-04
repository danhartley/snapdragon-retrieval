//https://dev.to/swyx/how-to-use-class-instead-of-classname-with-preact-and-typescript-2bjh
declare namespace React {
    interface HTMLAttributes<T> {
      // Preact supports using "class" instead of "classname" - need to teach typescript
      class?: string;
    }
  }