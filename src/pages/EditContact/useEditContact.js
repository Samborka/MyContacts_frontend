import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import useSafeAsyncAction from "../../hooks/useSafeAsyncAction";
import ContactsService from "../../services/ContactsService";
import toast from "../../utils/toast";

export default function useEditContact() {
  const [isLoading, setIsLoading] = useState(true);
  const [contactName, setContactName] = useState("");

  const contactFormRef = useRef(null);

  const { id } = useParams();
  const history = useHistory();

  const safeAsyncAction = useSafeAsyncAction();

  const loadContact = useCallback(async () => {
    try {
      const contactData = await ContactsService.getContactById(id);

      contactFormRef.current.setFieldsValues(contactData);

      safeAsyncAction(() => {
        setIsLoading(false);
        setContactName(contactData.name);
      });
    } catch (error) {
      safeAsyncAction(() => {
        history.push("/");
        toast({ type: "danger", text: "Contato não encontrado" });
      });
    }
  }, [id, history, safeAsyncAction]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  async function handleSubmit(contact) {
    try {
      const updatedContactData = await ContactsService.updateContact(
        id,
        contact
      );

      setContactName(updatedContactData.name);

      toast({
        type: "success",
        text: "Contato editado com sucesso!",
      });
    } catch {
      toast({
        type: "danger",
        text: "Ocorreu um erro ao editar o contato!",
      });
    }
  }

  return { isLoading, contactName, contactFormRef, handleSubmit };
}