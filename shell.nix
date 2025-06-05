{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  buildInputs = with pkgs; [
    docker
    bun
  ];
  shellHook = ''
    echo "=================================================="
    echo "To start MongoDB:   docker compose up"
    echo "To stop MongoDB:    docker compose down"
    echo ""
    echo "To install deps:    bun install"
    echo "To run Next.js:     bun run dev"
    echo "=================================================="
  '';
}
