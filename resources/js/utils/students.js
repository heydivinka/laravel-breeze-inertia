    import api from "./api";

    export const getStudents = async () => {
    const res = await api.get("/students");
    return res.data;
    };

    export const createStudent = async (data) => {
    const res = await api.post("/students", data);
    return res.data;
    };

    export const updateStudent = async (id, data) => {
    const res = await api.put(`/students/${id}`, data);
    return res.data;
    };

    export const deleteStudent = async (id) => {
    await api.delete(`/students/${id}`);
    };
