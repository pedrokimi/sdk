import { useState } from "react";

function App() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [resposta, setResposta] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      usuario,
      senha,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
    };

    try {
      const res = await fetch("http://localhost:3000/identity/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setResposta(json);
    } catch (error) {
      console.error("erro ao enviar dados:", error);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 400, margin: "auto" }}>
      <h2>login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="user"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          logar
        </button>
      </form>

      {resposta && (
        <div style={{ marginTop: "20px", background: "#f0f0f0", padding: "10px" }}>
          <strong>dados registrados:</strong>
          <pre>{JSON.stringify(resposta, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;