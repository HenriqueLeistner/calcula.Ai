import { useState, useEffect } from "react";
import { Send, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/date";

interface ParsedTransaction {
  amount: number;
  category: string;
  date: string;
  description: string;
  type: "income" | "expense";
}

function parseNaturalInput(
  input: string,
  categories: Array<{ id: string; name: string; type: "income" | "expense" }>,
  selectedType: "income" | "expense",
): ParsedTransaction | null {
  const text = input.toLowerCase().trim();

  const amountMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:reais?|r\$|real)?/);
  if (!amountMatch) return null;

  const amount = parseFloat(amountMatch[1].replace(",", "."));

  // Usar data de hoje sem problemas de timezone
  const today = new Date();
  let date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const dateMatch = text.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dateMatch) {
    const [_, day, month, year] = dateMatch;
    date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // Filtrar categorias pelo tipo selecionado
  const categoriesOfType = categories.filter((c) => c.type === selectedType);

  let foundCategory = categoriesOfType.find((cat) =>
    text.includes(cat.name.toLowerCase()),
  );

  if (!foundCategory) {
    foundCategory = categoriesOfType[0];
  }

  const words = text
    .split(/[,\s]+/)
    .filter(
      (w) =>
        w &&
        !w.match(/^\d/) &&
        w !== "reais" &&
        w !== "real" &&
        w !== "r$" &&
        !foundCategory?.name.toLowerCase().includes(w),
    );

  const description =
    words.slice(0, 3).join(" ") || foundCategory?.name || "Transação";

  return {
    amount,
    category: foundCategory!.id,
    date,
    description: description.charAt(0).toUpperCase() + description.slice(1),
    type: selectedType,
  };
}

export function ChatPage() {
  const [input, setInput] = useState("");
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense",
  );
  const [messages, setMessages] = useState<
    Array<{ text: string; isUser: boolean }>
  >(() => {
    // Carregar mensagens salvas do sessionStorage ao iniciar
    const saved = sessionStorage.getItem("chat-messages");
    return saved ? JSON.parse(saved) : [];
  });
  const { categories, addTransaction } = useFinanceStore();
  const { toast } = useToast();

  // Salvar mensagens no sessionStorage sempre que mudarem
  useEffect(() => {
    sessionStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const typeLabel =
      transactionType === "income" ? "💰 Receita" : "💸 Despesa";
    setMessages((prev) => [
      ...prev,
      { text: `${typeLabel}: ${userMessage}`, isUser: true },
    ]);
    setInput("");

    const parsed = parseNaturalInput(userMessage, categories, transactionType);

    if (!parsed) {
      setMessages((prev) => [
        ...prev,
        {
          text: '❌ Não consegui entender. Tente: "50 reais, mercado, 12/04/2025"',
          isUser: false,
        },
      ]);
      return;
    }

    try {
      await addTransaction(parsed);

      const categoryName = categories.find(
        (c) => c.id === parsed.category,
      )?.name;
      const formattedAmount = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(parsed.amount);

      setMessages((prev) => [
        ...prev,
        {
          text: `✅ ${transactionType === "income" ? "Receita" : "Despesa"} adicionada: ${formattedAmount} em ${categoryName} para ${formatDate(parsed.date)}`,
          isUser: false,
        },
      ]);

      toast({
        title: "Transação adicionada",
        description: `${formattedAmount} em ${categoryName}`,
      });
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "❌ Erro ao adicionar transação",
          isUser: false,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(98vh-118px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-4">
        {messages.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="font-semibold text-lg mb-2">Chat Financeiro</h3>
            <p className="mb-4">Digite suas transações de forma natural</p>
            <div className="space-y-2 text-left max-w-xs mx-auto">
              <p className="text-xs font-medium">Exemplos:</p>
              <div className="bg-muted p-2 rounded text-xs">
                💰 "12 reais mercado"
              </div>
              <div className="bg-muted p-2 rounded text-xs">
                🍔 "45.50 lazer"
              </div>
              <div className="bg-muted p-2 rounded text-xs">
                💼 "3000 salário 01/05/2025"
              </div>
              <div className="bg-muted p-2 rounded text-xs">🏠 "800 casa"</div>
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg text-sm max-w-[85%] ${
              msg.isUser
                ? "bg-primary text-primary-foreground ml-auto"
                : "bg-muted mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 p-4 border-t bg-card space-y-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant={transactionType === "income" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setTransactionType("income")}
          >
            💰 Receita
          </Button>
          <Button
            type="button"
            variant={transactionType === "expense" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setTransactionType("expense")}
          >
            💸 Despesa
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ex: 50 reais mercado"
            className="flex-1"
          />
          <Button onClick={handleSubmit} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
