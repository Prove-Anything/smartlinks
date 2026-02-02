/**
 * Evaluate whether a field's condition is satisfied.
 * Returns true if the field should be visible.
 *
 * @example
 * ```typescript
 * const field = schema.customFields.find(f => f.key === 'city')
 * const isVisible = evaluateCondition(field.condition, formValues)
 * ```
 */
export function evaluateCondition(condition, fieldValues) {
    if (!condition)
        return true; // No condition = always visible
    const value = fieldValues[condition.dependsOn];
    switch (condition.operator) {
        case 'isEmpty':
            return value == null || value === '' || (Array.isArray(value) && !value.length);
        case 'isNotEmpty':
            return value != null && value !== '' && !(Array.isArray(value) && !value.length);
        case 'isTrue':
            return value === true;
        case 'isFalse':
            return value === false;
        case 'equals':
            return value === condition.value;
        case 'notEquals':
            return value !== condition.value;
        case 'contains':
            return Array.isArray(value) && value.includes(condition.value);
        case 'notContains':
            return !Array.isArray(value) || !value.includes(condition.value);
        default:
            return true;
    }
}
