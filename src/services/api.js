import { supabase, isSupabaseConfigured } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';
export const BASE_BACKEND_URL = API_URL.replace(/\/api\/?$/, '');

export const api = {
  // Authentication
  registerCitizen: async (data) => {
    if (isSupabaseConfigured()) {
      const { nin, nom, prenom, email, password, commune, wilaya } = data;
      
      // 1. Check National Registry
      const { data: identity, error: registryError } = await supabase
        .from('national_registry')
        .select('*')
        .eq('nin', nin)
        .maybeSingle();

      if (registryError || !identity) {
        throw new Error("NIN non reconnu dans le registre national.");
      }

      if (
        identity.nom_fr.toLowerCase() !== nom.toLowerCase() ||
        identity.prenom_fr.toLowerCase() !== prenom.toLowerCase()
      ) {
        throw new Error("Les informations (Nom/Prénom) ne correspondent pas au NIN fourni.");
      }

      // 2. Check if user already exists
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .or(`email.eq.${email},nin.eq.${nin}`)
        .maybeSingle();

      if (existing) {
        throw new Error("Ce citoyen ou cet email est déjà inscrit.");
      }

      // 3. Create user profile
      const { data: newUser, error: insertError } = await supabase
        .from('profiles')
        .insert([{
          nin,
          nom: identity.nom_fr,
          prenom: identity.prenom_fr,
          email,
          password_hash: password,
          role: 'citoyen',
          commune: commune || identity.commune_residence,
          wilaya: wilaya || identity.wilaya_residence,
          date_naissance: identity.date_naissance,
          lieu_naissance: identity.lieu_naissance_fr
        }])
        .select()
        .single();

      if (insertError) throw new Error(insertError.message || "Erreur d'inscription Supabase");
      return newUser;
    }

    // Fallback to Express backend
    const res = await fetch(`${API_URL}/citizen/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || "Erreur d'inscription");
    }
    return res.json();
  },

  loginCitizen: async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .eq('role', 'citoyen')
        .maybeSingle();

      if (error || !user) throw new Error("Email ou mot de passe incorrect");
      return user;
    }

    const res = await fetch(`${API_URL}/citizen/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Email ou mot de passe incorrect");
    return res.json();
  },

  loginAgent: async (email, password) => {
    if (isSupabaseConfigured()) {
      const { data: agent, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .eq('role', 'agent')
        .maybeSingle();

      if (error || !agent) throw new Error("Identifiants agent incorrects");
      return agent;
    }

    const res = await fetch(`${API_URL}/agent/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error("Identifiants agent incorrects");
    return res.json();
  },

  // Requests
  getRequests: async (userId) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data.map(r => ({ ...r, userId: r.user_id }));
    }

    const res = await fetch(`${API_URL}/requests/citizen/${userId}`);
    return res.json();
  },
  
  createRequest: async (requestData) => {
    if (isSupabaseConfigured()) {
      const pieces = [];

      if (requestData.files && requestData.files.length > 0) {
        for (const file of requestData.files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
          const filePath = `${requestData.userId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('request-attachments')
            .upload(filePath, file);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('request-attachments')
              .getPublicUrl(filePath);

            pieces.push({
              name: file.name,
              filename: fileName,
              url: publicUrl
            });
          }
        }
      }

      const reqId = `DEM-${Date.now()}`;
      const newReq = {
        id: reqId,
        num: Math.floor(100 + Math.random() * 900).toString(),
        document: requestData.document,
        commune: requestData.commune,
        date: new Date().toLocaleDateString('fr-FR'),
        statut: 'pending',
        user_id: requestData.userId,
        pieces: pieces
      };

      const { data, error } = await supabase
        .from('requests')
        .insert([newReq])
        .select()
        .single();

      if (error) throw new Error(error.message || "Erreur lors de la création de la demande");
      return { ...data, userId: data.user_id };
    }

    const formData = new FormData();
    if (requestData.files) {
      requestData.files.forEach(file => {
        formData.append('files', file);
      });
    }

    const { files, ...otherData } = requestData;
    formData.append('data', JSON.stringify(otherData));

    const res = await fetch(`${API_URL}/requests`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },
  
  getNotifications: async (userId) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data.map(n => ({ ...n, userId: n.user_id, fileUrl: n.file_url }));
    }

    const res = await fetch(`${API_URL}/notifications/${userId}`);
    return res.json();
  },
  
  getHistory: async (userId) => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('generated_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data.map(d => ({ ...d, userId: d.user_id, requestId: d.request_id, fileUrl: d.file_url }));
    }

    const res = await fetch(`${API_URL}/documents/${userId}`);
    return res.json();
  },
  
  deleteNotification: async (id) => {
    if (isSupabaseConfigured()) {
      await supabase.from('notifications').delete().eq('id', id);
      return { success: true };
    }

    const res = await fetch(`${API_URL}/notifications/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  },
  
  updateRequestStatus: async (requestId, status, motif) => {
    if (isSupabaseConfigured()) {
      // 1. Get request
      const { data: request } = await supabase
        .from('requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) throw new Error('Request not found');

      // 2. Update status
      await supabase
        .from('requests')
        .update({ statut: status })
        .eq('id', requestId);

      let fileUrl = null;

      if (status === 'accepted') {
        fileUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=IDZ-DOC-${requestId}`;

        await supabase.from('generated_documents').insert([{
          id: `DOC-${Date.now()}`,
          name: request.document,
          type: 'Official',
          file_url: fileUrl,
          user_id: request.user_id,
          request_id: requestId,
          date: new Date().toLocaleDateString('fr-FR')
        }]);
      }

      await supabase.from('notifications').insert([{
        id: `NOT-${Date.now()}`,
        type: status,
        document: request.document,
        message: status === 'accepted' 
          ? `Votre demande de "${request.document}" a été acceptée. Votre document est prêt.` 
          : `Votre demande de "${request.document}" a été rejetée.`,
        motif: motif || '',
        user_id: request.user_id,
        file_url: fileUrl
      }]);

      return { success: true, fileUrl };
    }

    const res = await fetch(`${API_URL}/requests/${requestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut: status, motif })
    });
    return res.json();
  },

  getAllRequests: async () => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return [];
      return data.map(r => ({ ...r, userId: r.user_id }));
    }

    const res = await fetch(`${API_URL}/requests`);
    return res.json();
  }
};
