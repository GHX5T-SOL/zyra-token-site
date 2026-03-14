'use client';

export default function ContractBadge({ contract }: { contract: string }) {
  function copy() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(contract);
    }
  }
  return (
    <button type="button" className="contract-badge" onClick={copy} title="Copy">
      <span className="mono">{contract}</span>
    </button>
  );
}
