// static reference: the finished lockup (used to check the final frame against the client image)
window.FILM = { duration: 1, blur: () => 1, draw(ctx, t) { const m = K.stage(ctx); K.bg(ctx); K.shadow(ctx, m, K.silhouette, 1); K.stage(ctx); K.lockup(ctx); K.grain(ctx, t, 0.035, true); } };
