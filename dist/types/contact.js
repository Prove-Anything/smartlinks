/**
 * Evaluate whether a field's conditions are satisfied given the current form values.
 * Returns `true` if the field should be visible.
 *
 * @param conditions  The `conditions` array from a ContactSchemaProperty (may be undefined)
 * @param showWhen    'all' requires every condition to pass; 'any' requires at least one
 * @param fieldValues Current form values keyed by field ID
 *
 * @example
 * ```typescript
 * const property = schema.schema.properties[fieldId]
 * const visible = evaluateConditions(property.conditions, property.showWhen, formValues)
 * ```
 */
export function evaluateConditions(conditions, showWhen, fieldValues) {
    if (!conditions || conditions.length === 0)
        return true;
    const results = conditions.map(condition => {
        const value = fieldValues[condition.targetFieldId];
        switch (condition.operator) {
            case 'is_empty':
                return value == null || value === '' || (Array.isArray(value) && value.length === 0);
            case 'is_not_empty':
                return value != null && value !== '' && !(Array.isArray(value) && value.length === 0);
            case 'is_true':
                return value === true;
            case 'is_false':
                return value === false;
            case 'equals':
                return value === condition.value;
            case 'not_equals':
                return value !== condition.value;
            case 'contains':
                return Array.isArray(value)
                    ? value.includes(condition.value)
                    : typeof value === 'string' && value.includes(String(condition.value));
            case 'not_contains':
                return Array.isArray(value)
                    ? !value.includes(condition.value)
                    : typeof value === 'string' && !value.includes(String(condition.value));
            case 'greater_than':
                return typeof value === 'number' && typeof condition.value === 'number'
                    ? value > condition.value
                    : String(value) > String(condition.value);
            case 'less_than':
                return typeof value === 'number' && typeof condition.value === 'number'
                    ? value < condition.value
                    : String(value) < String(condition.value);
            default:
                return true;
        }
    });
    return (showWhen !== null && showWhen !== void 0 ? showWhen : 'all') === 'any'
        ? results.some(Boolean)
        : results.every(Boolean);
}
/**
 * @deprecated Use evaluateConditions (plural) instead.
 * Shim for code using the old single-condition API.
 */
export function evaluateCondition(condition, fieldValues) {
    var _a;
    if (!condition)
        return true;
    const targetFieldId = (_a = condition.dependsOn) !== null && _a !== void 0 ? _a : condition.targetFieldId;
    if (!targetFieldId)
        return true;
    return evaluateConditions([{ targetFieldId, operator: condition.operator, value: condition.value }], 'all', fieldValues);
}
