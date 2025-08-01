{shorts.map((s, i) => {
  const filename = s.url.split('/').pop();
  return (
    <div key={i} style={{ position: "relative", marginBottom: 20 }}>
      <video
        src={HOST + s.url}
        controls
        loop
        style={{
          width: "100%",
          height: "60vh",
          objectFit: "cover",
          borderRadius: 12
        }}
      />
      <button
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "#f33",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 5,
          cursor: "pointer"
        }}
        onClick={() => {
          if (!window.confirm("Delete this video?")) return;
          axios
            .delete(`${HOST}/delete/${filename}`, {
              headers: { "x-admin-key": ADMIN_KEY }
            })
            .then(() =>
              setShorts(prev => prev.filter(v => !v.url.endsWith(filename)))
            )
            .catch(() => alert("Delete failed!"));
        }}
      >
        Delete
      </button>
    </div>
  );
})}
