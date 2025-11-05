import InstallPrompt from '../InstallPrompt';

export default function InstallPromptExample() {
  return (
    <div className="h-96 relative bg-muted/20">
      <InstallPrompt />
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Prompt de instalação aparece no canto inferior direito
      </div>
    </div>
  );
}
